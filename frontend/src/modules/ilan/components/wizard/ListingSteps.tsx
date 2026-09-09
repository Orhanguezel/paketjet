import {Check} from 'lucide-react';
import {wizardSteps} from '../../ilan-wizard';
export default function ListingSteps({step,busy,onStep}:{step:number;busy:boolean;onStep:(index:number)=>void}){
 return <nav aria-label="İlan oluşturma adımları"><ol className="listing-steps">{wizardSteps.map((label,index)=><li key={label} data-active={step===index} data-complete={step>index}><button type="button" disabled={index>step||busy} aria-current={step===index?'step':undefined} onClick={()=>onStep(index)}><span className="listing-step-number">{step>index?<Check size={18}/>:index+1}</span><span>{label}</span></button></li>)}</ol></nav>;
}
