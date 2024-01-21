import * as crptyo from 'crptyo';

interface BlockShape {
   hash: string; //해쉬
   prevHash: string; //이전 해쉬값
   height: number; //블록 넘버
   data: string; //데이터
}

class Block implements BlockShape {
   public hash: string;
   constructor(
      public prevHash: string,
      public height: number,
      public data: string,
   ) {
      this.hash = Block.calc(prevHash, height, data);
   }

   static calc(prevHash: string, height: number, data: string): string {
      return '';
   }
}
