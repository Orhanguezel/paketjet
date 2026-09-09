import {memo,type Ref} from 'react';
// Keep generated heading anchors intact when the contents navigation updates.
export const LegalArticle=memo(function LegalArticle({html,title,articleRef}:{html:string;title:string;articleRef:Ref<HTMLElement>}){
 return <article ref={articleRef} className="legal-prose" aria-label={title} dangerouslySetInnerHTML={{__html:html}}/>;
});
