export const houses = [["ru", "Ru", "儒", "Confucian tradition", "Cultivate people through learning, ritual, and moral example.", "Kongzi · Mengzi · Xunzi", "Ren: humaneness. Li: ritual.", "Mengzi and Xunzi disagree about human nature; both value cultivation.", "Analects 2.3; Mengzi 2A6; Xunzi 19, 23"], ["dao", "Dao", "道", "Daoist tradition", "Reduce forced action and excessive desires; follow the Way.", "Laozi · Zhuangzi", "Wuwei: nonaction. Ziran: naturalness.", "Nonaction is not simply doing nothing. Wuwei also appears in other traditions.", "Daodejing 17, 37, 48; Zhuangzi 1–3"], ["mo", "Mo", "墨", "Mohist tradition", "Care impartially and judge policies by their benefit to people.", "Mozi", "Jian’ai: impartial concern. Feigong: against aggression.", "Mozi opposes aggressive war, not defending a community from attack.", "Mozi 8, 16, 17, 20"], ["fa", "Fa", "法", "Statecraft and standards", "Strengthen government through standards, rewards, and punishments.", "Han Feizi · Shang Yang", "Fa: standards. Shu: techniques. Shi: positional power.", "Han Feizi’s nonacting ruler still controls and evaluates ministers.", "Han Feizi 5, 7, 43; Book of Lord Shang 3–4"], ["fo", "Fo", "佛", "Buddhist tradition", "End suffering and the cycle of rebirth through Buddhist practice.", "Mouzi · Huiyuan · Wŏn’gwang", "Four Noble Truths · karma · nirvana", "Huiyuan defends monastic independence; Wŏn’gwang accepts duties to his king.", "SCT 416–419, 421–428; SKT 44–46"]];
export const items = [
 ['ru','Kongzi, Mengzi, and Xunzi','These thinkers disagree on important points but share the Ru commitment to moral cultivation.'],
 ['fo','Mouzi and Huiyuan','Both defend Buddhist practice in China. They answer objections about family obligations and political authority.'],
 ['mo','Mozi','Impartial concern and benefit to people are central to his arguments.'],
 ['fa','Han Feizi and Shang Yang','These texts emphasize standards, incentives, and state power.'],
 ['dao','Laozi and Zhuangzi','Their texts challenge forced action, excessive desires, and fixed judgments.'],
 ['mo','Care for other families and states, not only one’s own.','This paraphrases Mozi’s impartial concern: partiality produces harm.'],
 ['ru','Use ritual and moral example to cultivate conduct.','Analects 2.3 contrasts virtue and ritual with reliance on punishments.'],
 ['fo','Craving sustains suffering; disciplined practice can end it.','The Four Noble Truths connect suffering, its cause, its cessation, and a path. SCT 416–417: editors’ summary.'],
 ['dao','Reduce imposed demands instead of multiplying interventions.','Laozi connects nonaction with fewer desires and less coercive interference.'],
 ['fa','Keep rewards and punishments under the ruler’s control.','Han Feizi calls these the two handles. Ministers must not take control of them.'],
 ['fo','Monks need not bow before the ruler.','Huiyuan distinguishes people who leave household life from lay subjects. SCT 426–428.'],
 ['ru','Mengzi’s sprouts and Xunzi’s training both explain moral cultivation.','Their disagreement about human nature occurs within the Ru tradition.'],
 ['dao','Question fixed judgments about what is useful.','Zhuangzi’s stories unsettle conventional judgments of usefulness and worth.'],
 ['mo','Reject costly display that does not benefit people.','Mozi criticizes expenditure that consumes labor and resources without improving people’s lives.'],
 ['fa','Check officials’ claimed results against their assigned duties.','Han Feizi emphasizes control of ministers through standards and administrative techniques.'],
 ['dao','Ziran: what is so of itself; naturalness.','This is a basic Dao association. It does not mean that every human choice is wrong.'],
 ['fa','Promote agriculture and warfare to strengthen the state.','This is a distinctive priority in the Book of Lord Shang.'],
 ['mo','Oppose aggressive war while permitting defense.','Mozi condemns attacking other states; the Mohist tradition also develops defensive techniques.'],
 ['ru','Ren and li: humaneness and ritual.','These are central Ru commitments, not vocabulary used exclusively by Ru thinkers.'],
 ['fo','Wŏn’gwang teaches loyalty, filial piety, and restraint in killing.','His Five Commandments adapt Buddhist practice for lay followers in Silla. SKT 45–46.']
].map(([house,text,explanation],id)=>({id,house,text,explanation}));
export function correct(item,house){return item.house===house;}
