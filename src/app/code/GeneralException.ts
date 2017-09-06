export class GeneralException {
  constructor(protected message: string) {
  }
  
  getMessage(): string {
    this.beforeGetMessage();
    return this.message;
  }
  
  beforeGetMessage(): void {
    /*
     * TODO: implement Translate later
     *
     * Fỉre event
     */
    
  }
  
  toString() {
    return this.getMessage();
  }
}
