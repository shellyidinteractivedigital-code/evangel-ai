import EvangelMark from '../../components/brand/EvangelMark';
import SparklingStars from '../../components/brand/SparklingStars';

export default function AboutPage({onNavigate}){
  return <section className="page about-page">
    <header className="about-hero">
      <SparklingStars density="rich"/>
      <div className="about-road" aria-hidden="true"/>
      <EvangelMark className="about-mark"/>
      <p className="eyebrow">ABOUT US</p>
      <h1>Open the Word. Walk the road with understanding.</h1>
      <p className="about-lead">We created EVANGEL because discovering Scripture should feel alive, inspiring, and full of possibility. We are believers and educators who love helping people understand the Bible, explore the beauty of Hebrew and Greek, create meaningful prayers and sermons, and carry what they learn into everyday life.</p>
      <p>EVANGEL brings study, creativity, voice, and technology together in one welcoming space. It does not replace Scripture, prayer, pastors, teachers, community, or personal discernment. It simply helps more people open the Word, ask thoughtful questions, and move forward with faith, understanding, and hope.</p>
      <button className="primary" onClick={()=>onNavigate?.('whitepaper')}>Read Our White Paper</button>
    </header>
    <div className="about-story">
      <section><p className="eyebrow">WHY WE CREATED EVANGEL</p><h2>Faith deserves a place where the journey stays connected.</h2><p>A verse can become a question, a prayer, a journal entry, or a sermon. EVANGEL keeps those moments connected so people can return to what they learned and how it shaped their lives.</p></section>
      <section><p className="eyebrow">SCRIPTURE SHOULD BE UNDERSTOOD</p><h2>Curiosity belongs in faith.</h2><p>We welcome thoughtful questions and encourage reading the passage, its surrounding chapter, its historical setting, and the wider witness of Scripture before reaching a conclusion.</p></section>
      <section><p className="eyebrow">ANCIENT WORDS, LIVING MEANING</p><h2>The Concordant method matters.</h2><p>EVANGEL helps people compare how an important Hebrew or Greek word is used across passages. We separate the original-language text, grammar, lexical possibilities, translation choices, interpretation, and personal reflection. A word is never reduced to a single inspirational definition when its grammar and context tell a fuller story.</p></section>
      <section><p className="eyebrow">TECHNOLOGY IN SERVICE</p><h2>A helpful tool, never the authority.</h2><p>Technology can make careful study easier to begin and revisit. EVANGEL does not claim to speak for God. Generated prayers, sermons, and explanations are starting points for study, verification, discernment, and community.</p></section>
      <section><p className="eyebrow">PRAYER, STUDY, AND CREATION</p><h2>Bring what is on your heart.</h2><p>Ask a question, listen to Scripture, build a sermon from your notes, write a prayer, study a word, and save it in an organized folder or Faith Space where it can remain useful.</p></section>
      <section><p className="eyebrow">OUR PROMISE</p><h2>Humility, privacy, and care.</h2><p>We will keep explaining what comes from Scripture, what comes from source evidence, what is translation, and what is interpretation. We will protect subscriber access, preserve user choice, and keep improving EVANGEL with care.</p></section>
    </div>
    <blockquote className="about-manifesto">Created to serve the search for truth, while lording over none.</blockquote>
  </section>;
}