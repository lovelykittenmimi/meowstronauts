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
        '天一亮，補給船終於穿過沙塵，降落在希望一號。',
      ),
    },
    {
      cat: 'silver',
      mood: 'happy',
      text: l(
        'Seven sols. Everyone alive, the outpost intact, and the science log is... acceptable.',
        '七個火星日。全員平安，基地完好，科學日誌……勉強及格。',
      ),
    },
    {
      cat: 'narrator',
      text: l('Translation: Silver is thrilled.', '幫大家翻譯：銀白很開心。'),
    },
    {
      cat: 'silver',
      mood: 'surprised',
      text: l('I said no such thing.', '我沒說。'),
    },
    {
      cat: 'ginger',
      mood: 'happy',
      text: l(
        'The rescue ship is here! Do they have snacks? Wait — I have tomatoes! Tiny, dusty, perfect tomatoes. I grew them!',
        '補給船來了！他們有沒有帶零食？等等——我這裡有番茄！小小顆、沾著沙，完美！是我種的！',
      ),
    },
    {
      cat: 'shadow',
      mood: 'neutral',
      text: l(
        'The solar array is still crooked. I am calling it a design feature.',
        '太陽能板還是歪的。我就叫它設計特色。',
      ),
    },
    {
      cat: 'silver',
      mood: 'determined',
      text: l('We are not calling it that.', '這不叫設計特色。'),
    },
    {
      cat: 'ginger',
      mood: 'happy',
      text: l('The tomatoes are calling it that.', '番茄說這叫設計特色。'),
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
        '天一亮，補給船終於穿過沙塵，降落在希望一號。',
      ),
    },
    {
      cat: 'silver',
      mood: 'neutral',
      text: l('We survived. That is the headline.', '我們活下來了。這就夠上頭條了。'),
    },
    {
      cat: 'narrator',
      text: l(
        'The rest of the report is a long list of things they should have done.',
        '報告其他部分，滿滿都是「你們早就該做」的事。',
      ),
    },
    {
      cat: 'silver',
      mood: 'determined',
      text: l('The narrator is not on the payroll.', '旁白又沒領薪水。'),
    },
    {
      cat: 'shadow',
      mood: 'worried',
      text: l(
        'The outpost is still standing. So is the dent in the solar array. It has become part of the team.',
        '基地沒倒。太陽能板上的凹痕也還在。它現在也是團隊的一員了。',
      ),
    },
    {
      cat: 'ginger',
      mood: 'happy',
      text: l(
        'I kept everyone fed! Mostly. The emergency cookies were... emergency-adjacent.',
        '我沒讓大家餓到！大概吧。緊急餅乾……至少真的很緊急。',
      ),
    },
    {
      cat: 'silver',
      mood: 'neutral',
      text: l('We will discuss the cookies later.', '餅乾的事，晚點再說。'),
    },
    {
      cat: 'ginger',
      mood: 'worried',
      text: l('There are no cookies later?', '晚點就沒有餅乾了？'),
    },
    {
      cat: 'silver',
      mood: 'determined',
      text: l('That is what "later" means.', '「晚點再說」就是這個意思。'),
    },
  ],
  one: [
    {
      cat: 'narrator',
      text: l(
        'At sunrise, the supply ship finally breaks through the dust and lands at Hope-1.',
        '天一亮，補給船終於穿過沙塵，降落在希望一號。',
      ),
    },
    {
      cat: 'silver',
      mood: 'worried',
      text: l('We are alive. Technically.', '我們還活著。勉強算。'),
    },
    {
      cat: 'narrator',
      text: l(
        'The report says "mission complete" in the tone a doctor uses before "you should sit down."',
        '報告寫「任務完成」，但那個語氣，像醫生叫你「先坐下」。',
      ),
    },
    {
      cat: 'silver',
      mood: 'determined',
      text: l('I resent that comparison. I am sitting down.', '我抗議。而且我本來就坐著。'),
    },
    {
      cat: 'shadow',
      mood: 'worried',
      text: l('The good news: the oxygen recycler works.', '好消息：氧氣回收機還能用。'),
    },
    {
      cat: 'narrator',
      text: l('The bad news: everything else.', '壞消息：除了它，其他全有問題。'),
    },
    {
      cat: 'shadow',
      mood: 'surprised',
      text: l('I was getting to that.', '我正要說。'),
    },
    {
      cat: 'ginger',
      mood: 'sleepy',
      text: l(
        'I found a tomato in my pocket. It is warm. Does anyone want to split it? ...No? More for me.',
        '我在口袋裡找到一顆番茄。還溫溫的。有人要分嗎？……不要？那我吃囉。',
      ),
    },
    {
      cat: 'silver',
      mood: 'determined',
      text: l(
        'We are not doing a victory lap. We are doing a victory crawl.',
        '我們不是繞場慶祝。是爬著慶祝。',
      ),
    },
    {
      cat: 'ginger',
      mood: 'happy',
      text: l('A crawl is still a lap.', '爬也算繞一圈。'),
    },
  ],
  lose: [
    {
      cat: 'silver',
      mood: 'worried',
      text: l('The mission is paused. Not failed. Paused.', '任務只是暫停。不是失敗。是暫停。'),
    },
    {
      cat: 'narrator',
      text: l(
        'The outpost is dark, the oxygen is at zero, and the crew is out of snacks. But yes — paused.',
        '基地停電、氧氣歸零、零食也沒了。不過對啦——是暫停。',
      ),
    },
    {
      cat: 'silver',
      mood: 'surprised',
      text: l('Whose side are you on?', '你到底幫哪邊？'),
    },
    {
      cat: 'narrator',
      text: l('The side with the electric blanket.', '有電毯的那邊。'),
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
        '所以……補給船不來了？我菜單都想好了耶。',
      ),
    },
    {
      cat: 'silver',
      mood: 'determined',
      text: l(
        'We will try again. And this time, we will check the power before the snacks.',
        '我們再試一次。這次先顧電力，再顧零食。',
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
      text: l('...That is not how power works.', '……電力不是這樣來的。'),
    },
  ],
};
