import type { CatId, Localized } from '../game/types';
import type { FaceMood } from './catFaces';

export type EndingSpeaker = CatId | 'narrator';

export interface EndingLine {
  cat: EndingSpeaker;
  mood?: FaceMood;
  text: Localized;
}

const l = (en: string, zh: string): Localized => ({ en, 'zh-TW': zh });

export const ENDING_DIALOGUES: Record<'one' | 'two' | 'three' | 'lose', EndingLine[]> = {
  three: [
    {
      cat: 'narrator',
      text: l(
        'At sunrise, the supply ship finally breaks through the dust and lands at Hope-1.',
        '日出時，補給船終於穿過沙塵，降落在希望一號。',
      ),
    },
    {
      cat: 'silver',
      mood: 'happy',
      text: l(
        'Seven sols. Everyone alive, the outpost intact, and the science log is... acceptable.',
        '七個火星日。大家都活著、基地完好、科學紀錄……勉強合格。',
      ),
    },
    {
      cat: 'narrator',
      text: l('Translation: Silver is thrilled.', '翻譯：銀白非常滿意。'),
    },
    {
      cat: 'silver',
      mood: 'surprised',
      text: l('I said no such thing.', '我沒有這樣說。'),
    },
    {
      cat: 'ginger',
      mood: 'happy',
      text: l(
        'The rescue ship is here! Do they have snacks? Wait — I have tomatoes! Tiny, dusty, perfect tomatoes. I grew them!',
        '補給船來了！他們有帶零食嗎？等等——我有番茄！小小的、有沙塵的、完美的番茄。我種的！',
      ),
    },
    {
      cat: 'shadow',
      mood: 'neutral',
      text: l(
        'The solar array is still crooked. I am calling it a design feature.',
        '太陽能板還是歪的。我決定叫它「設計特色」。',
      ),
    },
    {
      cat: 'silver',
      mood: 'determined',
      text: l('We are not calling it that.', '我們不會叫它那個。'),
    },
    {
      cat: 'ginger',
      mood: 'happy',
      text: l('The tomatoes are calling it that.', '番茄說可以。'),
    },
    {
      cat: 'silver',
      mood: 'neutral',
      text: l('...The tomatoes may stay.', '……番茄可以留下。'),
    },
  ],
  two: [
    {
      cat: 'narrator',
      text: l(
        'At sunrise, the supply ship finally breaks through the dust and lands at Hope-1.',
        '日出時，補給船終於穿過沙塵，降落在希望一號。',
      ),
    },
    {
      cat: 'silver',
      mood: 'neutral',
      text: l('We survived. That is the headline.', '我們活下來了。這是頭條。'),
    },
    {
      cat: 'narrator',
      text: l(
        'The rest of the report is a long list of things they should have done.',
        '報告其餘部分是一長串他們早該做的事。',
      ),
    },
    {
      cat: 'silver',
      mood: 'determined',
      text: l('The narrator is not on the payroll.', '旁白不在薪資名單上。'),
    },
    {
      cat: 'shadow',
      mood: 'worried',
      text: l(
        'The outpost is still standing. So is the dent in the solar array. It has become part of the team.',
        '基地還站著。太陽能板上的凹痕也還站著。它已經成為團隊的一員。',
      ),
    },
    {
      cat: 'ginger',
      mood: 'happy',
      text: l(
        'I kept everyone fed! Mostly. The emergency cookies were... emergency-adjacent.',
        '我讓大家都有飯吃！大概吧。緊急餅乾……算是有緊急到。',
      ),
    },
    {
      cat: 'silver',
      mood: 'neutral',
      text: l('We will discuss the cookies later.', '餅乾的事晚點再說。'),
    },
    {
      cat: 'ginger',
      mood: 'worried',
      text: l('There are no cookies later?', '晚點就沒有餅乾了？'),
    },
    {
      cat: 'silver',
      mood: 'determined',
      text: l('That is what "later" means.', '「晚點」就是這個意思。'),
    },
  ],
  one: [
    {
      cat: 'narrator',
      text: l(
        'At sunrise, the supply ship finally breaks through the dust and lands at Hope-1.',
        '日出時，補給船終於穿過沙塵，降落在希望一號。',
      ),
    },
    {
      cat: 'silver',
      mood: 'worried',
      text: l('We are alive. Technically.', '我們還活著。技術上來說。'),
    },
    {
      cat: 'narrator',
      text: l(
        'The report says "mission complete" in the tone a doctor uses before "you should sit down."',
        '報告上寫「任務完成」，語氣像醫生說「你先坐下」之前那樣。',
      ),
    },
    {
      cat: 'silver',
      mood: 'determined',
      text: l('I resent that comparison. I am sitting down.', '我抗議這個比喻。我已經坐下了。'),
    },
    {
      cat: 'shadow',
      mood: 'worried',
      text: l('The good news: the oxygen recycler works.', '好消息：氧氣回收機還能用。'),
    },
    {
      cat: 'narrator',
      text: l('The bad news: everything else.', '壞消息：其他全部。'),
    },
    {
      cat: 'shadow',
      mood: 'surprised',
      text: l('I was getting to that.', '我正準備要說。'),
    },
    {
      cat: 'ginger',
      mood: 'sleepy',
      text: l(
        'I found a tomato in my pocket. It is warm. Does anyone want to split it? ...No? More for me.',
        '我在口袋裡找到一顆番茄。它是溫的。有人要分嗎？……不要？那我全吃了。',
      ),
    },
    {
      cat: 'silver',
      mood: 'determined',
      text: l(
        'We are not doing a victory lap. We are doing a victory crawl.',
        '我們不是在跑勝利圈。我們是在爬勝利圈。',
      ),
    },
    {
      cat: 'ginger',
      mood: 'happy',
      text: l('A crawl is still a lap.', '爬也算一圈。'),
    },
  ],
  lose: [
    {
      cat: 'silver',
      mood: 'worried',
      text: l('The mission is paused. Not failed. Paused.', '任務暫停。不是失敗。是暫停。'),
    },
    {
      cat: 'narrator',
      text: l(
        'The outpost is dark, the oxygen is at zero, and the crew is out of snacks. But yes — paused.',
        '基地停電、氧氣歸零、零食也沒了。不過沒錯——是暫停。',
      ),
    },
    {
      cat: 'silver',
      mood: 'surprised',
      text: l('Whose side are you on?', '你站在哪一邊？'),
    },
    {
      cat: 'narrator',
      text: l('The side with the electric blanket.', '有電毯的那一邊。'),
    },
    {
      cat: 'shadow',
      mood: 'worried',
      text: l('There is no electric blanket.', '基地沒有電毯。'),
    },
    {
      cat: 'ginger',
      mood: 'surprised',
      text: l(
        'So... the rescue ship is not coming? I had a whole menu planned.',
        '所以……補給船不會來了？我已經想好整套菜單了。',
      ),
    },
    {
      cat: 'silver',
      mood: 'determined',
      text: l(
        'We will try again. And this time, we will check the power before the snacks.',
        '我們會再試一次。這次，先檢查電力，再談零食。',
      ),
    },
    {
      cat: 'ginger',
      mood: 'determined',
      text: l('The snacks are the power.', '零食就是電力。'),
    },
    {
      cat: 'silver',
      mood: 'neutral',
      text: l('...That is not how power works.', '……電力不是這樣運作的。'),
    },
  ],
};
