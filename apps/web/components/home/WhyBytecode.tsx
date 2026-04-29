import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";

const pillars = [
  {
    title: "Specialist, not generalist",
    body: "Java and Kotlin share a runtime, an ecosystem, and most idioms. Learning both makes you dramatically more hireable than knowing ten languages superficially.",
    icon: "◎",
  },
  {
    title: "No anxiety mechanics",
    body: "No hearts. No mistake limits. No streak-shaming. Make as many mistakes as you want — that's literally how learning works.",
    icon: "○",
  },
  {
    title: "Quizzes that teach, projects that prove",
    body: "Five formats of quizzes interleaved through every lesson, plus capstone challenges and real projects you can put on your CV.",
    icon: "◇",
  },
];

export function WhyBytecode() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20 lg:py-28">
      <SectionHeader
        label="why bytecode"
        heading="The only JVM path you'll need."
        subheading="Most coding apps teach you a little of twenty languages. Bytecode teaches you two — Java and Kotlin — deeply. Beginner syntax. Object-oriented design. Concurrency. Spring Boot. Android. Job-ready by the end."
        className="mb-12"
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {pillars.map(({ title, body, icon }) => (
          <Card key={title} padding="lg">
            <span
              className="text-2xl text-accent mb-4 block"
              aria-hidden="true"
            >
              {icon}
            </span>
            <h3 className="text-lg font-semibold text-prose mb-2 tracking-tight">
              {title}
            </h3>
            <p className="text-sm text-prose-muted leading-relaxed">{body}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
