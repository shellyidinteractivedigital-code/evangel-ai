const STARS=[
  [7,16,2,.2,.7],[15,45,1,.8,.5],[23,9,3,1.4,.9],[31,68,2,2.1,.6],[39,27,1,2.8,.5],[47,52,2,3.4,.8],
  [54,13,1,4.1,.6],[62,74,3,4.8,.9],[70,35,2,5.5,.7],[78,8,1,1.1,.5],[86,58,2,1.8,.8],[94,22,3,2.5,.9],
  [11,82,1,3.2,.5],[19,31,2,3.9,.7],[27,91,1,4.6,.6],[35,5,2,5.3,.8],[43,79,3,.5,.9],[51,39,1,1.2,.5],
  [59,94,2,1.9,.7],[67,19,1,2.6,.6],[75,86,2,3.3,.8],[83,43,1,4,.5],[91,76,2,4.7,.7],[97,48,1,5.4,.6]
];
export default function SparklingStars({className='',density='soft'}){
  const stars=density==='rich'?STARS:STARS.slice(0,16);
  return <span className={`sparkling-stars ${className}`.trim()} aria-hidden="true">{stars.map(([x,y,size,delay,depth],i)=><i className="sparkling-star" key={i} style={{'--x':`${x}%`,'--y':`${y}%`,'--size':`${size}px`,'--delay':`${delay}s`,'--depth':depth}}/>)}</span>;
}