/* Pocket Field Test: original MIT-licensed GBA cartridge. No commercial assets.
 * Mode 4 uses two video pages; DMA copy and VBlank flip prevent torn frames. */
typedef unsigned short u16; typedef unsigned int u32;
#define REG(x) (*(volatile u16 *)(x))
#define REG32(x) (*(volatile u32 *)(x))
#define RGB(r,g,b) ((r)|((g)<<5)|((b)<<10))
static void rect(volatile u16 *page,int x,int y,int w,int h,int c){
 if(x<0){w+=x;x=0;}if(y<0){h+=y;y=0;}if(x+w>240)w=240-x;if(y+h>160)h=160-y;
 if(w<=0||h<=0)return;
 u16 cc=c|(c<<8);
 for(int j=0;j<h;j++){
  volatile u16 *p=page+(y+j)*120+(x>>1);int n=w;
  if(x&1){*p=(*p&255)|(c<<8);p++;n--;}
  while(n>=2){*p++=cc;n-=2;}
  if(n)*p=(*p&0xff00)|c;
 }
}
static const unsigned char letters[26][7]={
 {14,17,17,31,17,17,17},{30,17,17,30,17,17,30},{14,17,16,16,16,17,14},
 {30,17,17,17,17,17,30},{31,16,16,30,16,16,31},{31,16,16,30,16,16,16},
 {14,17,16,23,17,17,15},{17,17,17,31,17,17,17},{14,4,4,4,4,4,14},
 {7,2,2,2,2,18,12},{17,18,20,24,20,18,17},{16,16,16,16,16,16,31},
 {17,27,21,21,17,17,17},{17,25,21,19,17,17,17},{14,17,17,17,17,17,14},
 {30,17,17,30,16,16,16},{14,17,17,17,21,18,13},{30,17,17,30,20,18,17},
 {15,16,16,14,1,1,30},{31,4,4,4,4,4,4},{17,17,17,17,17,17,14},
 {17,17,17,17,17,10,4},{17,17,17,21,21,21,10},{17,17,10,4,10,17,17},
 {17,17,10,4,4,4,4},{31,1,2,4,8,16,31}};
static void text(volatile u16*p,int x,int y,const char*s,int c){while(*s){int a=*s++-'A';if(a>=0&&a<26)for(int j=0;j<7;j++)for(int i=0;i<5;i++)if(letters[a][j]&(1<<(4-i)))rect(p,x+i,y+j,1,1,c);x+=6;}}
int main(void){
 volatile u16 *pal=(volatile u16*)0x05000000;
 pal[0]=RGB(3,8,10);pal[1]=RGB(5,12,12);pal[2]=RGB(2,5,7);pal[3]=RGB(17,25,19);pal[4]=RGB(24,28,25);pal[5]=RGB(13,19,18);pal[6]=RGB(31,26,10);pal[7]=RGB(10,13,14);pal[8]=RGB(6,10,10);pal[9]=RGB(31,3,20);pal[10]=RGB(31,31,29);pal[11]=RGB(24,23,31);pal[12]=RGB(17,22,22);
 REG(0x04000000)=0x0404;REG(0x04000084)=0x80;REG(0x04000080)=0x1177;REG(0x04000082)=2;
 volatile u16 *background=(volatile u16*)0x02000000;
 for(int i=0;i<19200;i++)background[i]=0;
 rect(background,0,114,240,46,1);rect(background,0,133,240,27,2);rect(background,0,131,240,2,3);
 text(background,12,12,"POCKET FIELD TEST",4);text(background,12,23,"AN ORIGINAL GBA CARTRIDGE",5);
 for(int i=0;i<11;i++)rect(background,i*22+3,136,9,1,8);
 text(background,12,147,"ARROWS MOVE   X JUMP   ENTER RESTART",12);
 int x=24,y=119,vy=0,prev=0,coins=0,back=1;
 while(1){
  int keys=(~REG(0x04000130))&1023;
  if(keys&16)x+=2;if(keys&32)x-=2;if(x<4)x=4;if(x>224)x=224;
  if((keys&1)&&!(prev&1)&&y==119){vy=-7;REG(0x04000062)=0xF080;REG(0x04000064)=0xC640;}
  if(y<119||vy){y+=vy;vy++;if(y>=119){y=119;vy=0;}}
  if((keys&8)&&!(prev&8)){coins=0;x=24;y=119;vy=0;}
  prev=keys;volatile u16 *p=(volatile u16*)(back?0x0600A000:0x06000000);
  REG32(0x040000D4)=(u32)background;REG32(0x040000D8)=(u32)p;REG32(0x040000DC)=0x84000000|9600;
  for(int i=0;i<3;i++){int cx=76+i*56;if(!(coins&(1<<i))){rect(p,cx,103,5,7,6);rect(p,cx+1,101,3,11,6);if(x+9>cx&&x<cx+6&&y<113){coins|=1<<i;REG(0x04000062)=0xA080;REG(0x04000064)=0xC720;}}rect(p,177+i*14,12,8,4,(coins&(1<<i))?6:7);}
  rect(p,x+2,y,8,9,9);rect(p,x,y+3,12,5,9);rect(p,x+7,y+2,2,2,10);rect(p,x+2,y+9,3,3,11);rect(p,x+7,y+9,3,3,11);
  if(coins==7){rect(p,10,145,220,10,2);text(p,12,147,"ALL COLLECTED  START TO REPLAY",12);}
  while(REG(0x04000006)>=160){}while(REG(0x04000006)<160){}
  REG(0x04000000)=0x0404|(back?0x10:0);back^=1;
 }
}
