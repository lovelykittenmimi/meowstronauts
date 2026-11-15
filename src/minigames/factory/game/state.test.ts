import {
  CO2_MOLECULE_IDS,
  ICE_SPOT,
  applyFactoryAction,
  completedStationCount,
  createFactoryGame,
  isFactoryComplete,
  type FactoryAction,
  type FactoryGame,
} from './state';

function start(): FactoryGame {
  return applyFactoryAction(createFactoryGame(), { type: 'START' });
}

function run(game: FactoryGame, ...actions: FactoryAction[]): FactoryGame {
  return actions.reduce(applyFactoryAction, game);
}

function atElectrolysis(): FactoryGame {
  return run(
    start(),
    { type: 'DIG', spot: ICE_SPOT },
    { type: 'CHOOSE_OVEN', oven: 'sealed' },
    { type: 'BAKE' },
  );
}

function atScrubber(): FactoryGame {
  return run(
    atElectrolysis(),
    { type: 'SPLIT' },
    { type: 'ROUTE_GAS', gas: 'o2', to: 'crew' },
    { type: 'ROUTE_GAS', gas: 'h2', to: 'fuel' },
  );
}

function atReactor(): FactoryGame {
  return run(
    atScrubber(),
    ...CO2_MOLECULE_IDS.map(
      (molecule): FactoryAction => ({ type: 'CAPTURE', molecule }),
    ),
    { type: 'HEAT_FILTER' },
  );
}

describe('water & fuel factory state', () => {
  it('starts idle and ignores station actions before START', () => {
    const game = createFactoryGame();
    expect(game.stationIndex).toBe(0);
    expect(game.started).toBe(false);
    expect(
      applyFactoryAction(game, { type: 'DIG', spot: ICE_SPOT }),
    ).toBe(game);
  });

  it('needs the ice spot before the oven appears', () => {
    const game = start();
    const wrong = applyFactoryAction(game, { type: 'DIG', spot: 'alpha' });

    expect(wrong).toBe(game);
    expect(wrong.mine.spot).toBeNull();

    const found = applyFactoryAction(game, { type: 'DIG', spot: ICE_SPOT });
    expect(found.mine.spot).toBe(ICE_SPOT);
    expect(found.stationIndex).toBe(0);
  });

  it('does not advance with an open tray, but does with a sealed oven', () => {
    const found = run(start(), { type: 'DIG', spot: ICE_SPOT });
    const open = applyFactoryAction(found, {
      type: 'CHOOSE_OVEN',
      oven: 'open',
    });
    expect(open.mine.oven).toBe('open');

    const bakedOpen = applyFactoryAction(open, { type: 'BAKE' });
    expect(bakedOpen).toBe(open);
    expect(bakedOpen.stationIndex).toBe(0);

    const sealed = applyFactoryAction(open, {
      type: 'CHOOSE_OVEN',
      oven: 'sealed',
    });
    const baked = applyFactoryAction(sealed, { type: 'BAKE' });
    expect(baked.mine.done).toBe(true);
    expect(baked.stationIndex).toBe(1);
    expect(completedStationCount(baked)).toBe(1);
  });

  it('routes both gases to the correct tanks', () => {
    const game = atElectrolysis();
    expect(game.electrolysis.split).toBe(false);

    const powered = applyFactoryAction(game, { type: 'SPLIT' });
    expect(powered.electrolysis.split).toBe(true);

    const wrong = applyFactoryAction(powered, {
      type: 'ROUTE_GAS',
      gas: 'o2',
      to: 'fuel',
    });
    expect(wrong).toBe(powered);

    const o2 = applyFactoryAction(powered, {
      type: 'ROUTE_GAS',
      gas: 'o2',
      to: 'crew',
    });
    expect(o2.electrolysis.o2).toBe(true);
    expect(o2.electrolysis.done).toBe(false);
    expect(o2.stationIndex).toBe(1);

    const h2 = applyFactoryAction(o2, {
      type: 'ROUTE_GAS',
      gas: 'h2',
      to: 'fuel',
    });
    expect(h2.electrolysis.h2).toBe(true);
    expect(h2.electrolysis.done).toBe(true);
    expect(h2.stationIndex).toBe(2);
  });

  it('catches only CO₂ and needs all four before heating the filter', () => {
    const game = atScrubber();
    expect(game.stationIndex).toBe(2);

    const wrong = applyFactoryAction(game, {
      type: 'CAPTURE',
      molecule: 'n2',
    });
    expect(wrong).toBe(game);
    expect(wrong.scrubber.caught).toHaveLength(0);

    const partial = applyFactoryAction(game, {
      type: 'CAPTURE',
      molecule: CO2_MOLECULE_IDS[0],
    });
    expect(partial.scrubber.caught).toEqual([CO2_MOLECULE_IDS[0]]);
    expect(
      applyFactoryAction(partial, { type: 'HEAT_FILTER' }),
    ).toBe(partial);

    const caught = run(
      game,
      ...CO2_MOLECULE_IDS.map(
        (molecule): FactoryAction => ({ type: 'CAPTURE', molecule }),
      ),
    );
    expect(caught.scrubber.caught).toHaveLength(4);

    const heated = applyFactoryAction(caught, { type: 'HEAT_FILTER' });
    expect(heated.scrubber.done).toBe(true);
    expect(heated.scrubber.released).toBe(true);
    expect(heated.stationIndex).toBe(3);
  });

  it('collects methane and water in the right tanks to finish', () => {
    const game = atReactor();
    expect(game.stationIndex).toBe(3);

    const reacted = applyFactoryAction(game, { type: 'REACT' });
    expect(reacted.reactor.reacted).toBe(true);

    const wrong = applyFactoryAction(reacted, {
      type: 'COLLECT_OUTPUT',
      output: 'methane',
      to: 'water',
    });
    expect(wrong).toBe(reacted);

    const methane = applyFactoryAction(reacted, {
      type: 'COLLECT_OUTPUT',
      output: 'methane',
      to: 'fuel',
    });
    expect(methane.reactor.methane).toBe(true);
    expect(methane.completed).toBe(false);
    expect(isFactoryComplete(methane)).toBe(false);

    const water = applyFactoryAction(methane, {
      type: 'COLLECT_OUTPUT',
      output: 'water',
      to: 'water',
    });
    expect(water.reactor.water).toBe(true);
    expect(water.reactor.done).toBe(true);
    expect(water.completed).toBe(true);
    expect(isFactoryComplete(water)).toBe(true);
    expect(completedStationCount(water)).toBe(4);
    expect(water.stationIndex).toBe(3);
  });

  it('resets to a fresh, unstarted game', () => {
    const finished = run(
      atReactor(),
      { type: 'REACT' },
      { type: 'COLLECT_OUTPUT', output: 'methane', to: 'fuel' },
      { type: 'COLLECT_OUTPUT', output: 'water', to: 'water' },
    );
    expect(finished.completed).toBe(true);

    const reset = applyFactoryAction(finished, { type: 'RESET' });
    expect(reset).toEqual(createFactoryGame());
    expect(reset.started).toBe(false);
    expect(reset.completed).toBe(false);
  });
});
