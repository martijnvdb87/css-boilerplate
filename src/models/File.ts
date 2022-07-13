export default class File {
  public filename: string = '';
  public content: string = '';
  public type: string = 'text/plain';
  public charset: string = 'utf-8';

  constructor(filename: string = '', content: string = '') {
    this.filename = filename;
    this.content = content;
  }

  download() {
    var element = document.createElement('a');
    element.setAttribute('href', `data:${this.type};charset=${this.charset},${encodeURIComponent(this.content)}`);
    element.setAttribute('download', this.filename);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
  }
}
