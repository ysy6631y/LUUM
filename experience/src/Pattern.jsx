import React from 'react';
// Pattern directions are taken from the original gold geometry, never from the asset order.
export function Pattern({type, className='', ...props}) {
  const lines=[];
  if(type==='horizontal') for(let y=5;y<100;y+=7)lines.push(`M0 ${y}H100`);
  if(type==='diagonal')for(let x=-100;x<200;x+=14)lines.push(`M${x} 100l100 -100`);
  if(type==='diamond')for(let x=-100;x<200;x+=20){lines.push(`M${x} 0l50 100`,`M${x} 0l-50 100`);}
  if(type==='orthogonal')for(let n=0;n<=100;n+=12.5)lines.push(`M${n} 0V100M0 ${n}H100`);
  if(type==='chevron')for(let y=-8;y<110;y+=9)lines.push(`M-10 ${y}l10 -5 10 5 10-5 10 5 10-5 10 5 10-5 10 5 10-5 10 5 10-5 10 5`);
  return <svg viewBox="0 0 100 100" fill="none" className={`pattern ${className}`} aria-hidden="true" {...props}><path d={lines.join(' ')} stroke="currentColor" strokeWidth=".65" vectorEffect="non-scaling-stroke"/></svg>;
}
