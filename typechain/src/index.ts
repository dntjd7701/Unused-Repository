import crypto from 'crypto';

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
      const toHash = `${prevHash}${height}${data}`;
      return crypto.createHash('sha256').update(toHash).digest('hex');
   }
}

class Blockchain {
   private blocks: Block[];

   constructor() {
      this.blocks = [];
   }

   private getPrevHash(): string {
      if (this.blocks.length === 0) return '';
      return this.blocks[this.blocks.length - 1].hash;
   }

   public addBlock(data: string) {
      const newBlock = new Block(
         this.getPrevHash(),
         this.blocks.length + 1,
         data,
      );

      this.blocks.push(newBlock);
   }

   public getBlocks() {
      return [...this.blocks];
   }
}

const blockchain = new Blockchain();

blockchain.addBlock('첫번째');
blockchain.addBlock('두번째');
blockchain.addBlock('세번째');

console.log(blockchain.getBlocks());
