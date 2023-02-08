export default class KeysClass {
  static instances = [];

  constructor(code, russian, russianUp, english, englishUp) {
    this.code = code;
    this.russian = russian;
    this.russianUp = russianUp;
    this.english = english;
    this.englishUp = englishUp;
    this.node = document.createElement('button');
    this.node.classList.add('button-key');
    KeysClass.instances.push(this);
  }
}

export function getCharSc(code, lang, up) {
  let answer;
  for (let i = 0; i < KeysClass.instances.length; i += 1) {
    if (KeysClass.instances[i].code === code) {
      answer = KeysClass.instances[i][`${lang}${up}`];
    }
  }
  return answer;
}
