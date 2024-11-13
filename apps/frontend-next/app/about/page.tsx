
const About = ()=> (
  <div className="container flex flex-col items-start gap-2 py-12 font-sans">
    <h1 className="text-2xl font-semibold tracking-tight">
      About
    </h1>
    <p className="text-primary text-md leading-7">
      Neo Starter DDD is a template that provides an easier and faster way to start a project using Next.js, Node.js and TypeScript.
      <br />
      <br />
      It&apos;s a monorepo that focuses on a proper implementation of Clean Architecture and DDD, which is achieved by [truly] isolating layers using a concept of packages. It also comes with some awesome out-of-the-box features (see Backend / Frontend sections below).
    </p>
  </div>
);

export default About;