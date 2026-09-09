import {ImageResponse} from 'next/og';
export const alt='PaketJet — Taşıyıcıyla doğrudan iletişim';
export const size={width:1200,height:630};
export const contentType='image/png';
export default function ShareImage(){
 return new ImageResponse(<div style={{display:'flex',width:'100%',height:'100%',padding:80,flexDirection:'column',justifyContent:'center',background:'hsl(250, 75%, 97%)',color:'hsl(220, 35%, 14%)'}}>
  <div style={{display:'flex',fontSize:46,fontWeight:700,marginBottom:50}}>Paket<span style={{color:'hsl(256, 67%, 49%)'}}>Jet</span></div>
  <div style={{display:'flex',fontSize:66,fontWeight:700,maxWidth:1000,lineHeight:1.15}}>Taşıyıcıyla doğrudan iletişim.</div>
  <div style={{display:'flex',fontSize:28,marginTop:30}}>Güzergâhları keşfet. Yolunu ücretsiz paylaş.</div>
  <div style={{display:'flex',fontSize:24,marginTop:60,color:'hsl(256, 67%, 49%)'}}>paketjet.com</div>
 </div>,size);
}
