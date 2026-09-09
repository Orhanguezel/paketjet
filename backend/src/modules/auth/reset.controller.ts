import type {FastifyRequest,FastifyReply} from 'fastify';
import {env} from '@/core/env';
import {handleRouteError} from '../_shared';
import {sendMailRaw,sendPasswordChangedMail} from '../mail/service';
import {passwordResetRequestBody,passwordResetConfirmBody} from './validation';
import {repoGetUserByEmail,repoCreatePasswordChangedNotification} from './repository';
import {repoCreatePasswordReset,repoConsumePasswordReset} from './reset.repository';
const accepted={success:true,message:'Bu e-posta ile etkin bir hesap varsa sıfırlama bağlantısı gönderilecektir.'};
export async function passwordResetRequest(req:FastifyRequest,reply:FastifyReply){
 try{
  const {email}=passwordResetRequestBody.parse(req.body);
  const user=await repoGetUserByEmail(email.toLowerCase());
  if(user?.is_active){
   const token=await repoCreatePasswordReset(user.id);
   const url=`${env.FRONTEND_URL}/sifre-sifirla?token=${encodeURIComponent(token)}`;
   // Never expose a reset credential through the API, logs or admin UI.
   void sendMailRaw({to:user.email,subject:'PaketJet — Şifre sıfırlama',text:`Şifreni sıfırlamak için bir saat içinde bu bağlantıyı aç: ${url}\n\nBu isteği sen yapmadıysan dikkate alma.`}).catch(()=>req.log.error({code:'password_reset_mail_failed'},'password_reset_mail_failed'));
  }
  return reply.send(accepted);
 }catch(error){return handleRouteError(reply,req,error,'password_reset_request');}
}
export async function passwordResetConfirm(req:FastifyRequest,reply:FastifyReply){
 try{
  const body=passwordResetConfirmBody.parse(req.body),user=await repoConsumePasswordReset(body.token,body.password);
  if(!user)return reply.code(400).send({error:{message:'invalid_or_expired_token'}});
  await repoCreatePasswordChangedNotification(user.id);
  void sendPasswordChangedMail({to:user.email}).catch(()=>req.log.error({code:'password_changed_mail_failed'},'password_changed_mail_failed'));
  return reply.send({success:true,message:'Şifren güncellendi. Yeni şifrenle giriş yapabilirsin.'});
 }catch(error){return handleRouteError(reply,req,error,'password_reset_confirm');}
}
