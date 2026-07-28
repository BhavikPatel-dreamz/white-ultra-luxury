import { testimonials } from "@/lib/data";
import { Container } from "@/components/ui/container";
import { Icon } from "@/components/ui/icon";

export function TestimonialsSection() {
  return (
    <section className="bg-background">
      <Container className="py-24 md:py-28">
        <div className="grid items-start gap-12 md:grid-cols-[15rem_1fr] md:gap-16">
          <div>
            <div className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-primary">
              Customer reviews
            </div>
            <div className="mt-4 flex items-center gap-3">
              <div className="font-display text-6xl font-semibold tabular-nums">4.8</div>
              <div className="flex flex-col">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Icon className="size-4 fill-primary text-primary" key={index} name="star" />
                  ))}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">3,214 verified reviews</div>
              </div>
            </div>
            <p className="mt-5 max-w-[13rem] text-sm leading-relaxed text-muted-foreground">
              Feedback from verified adult customers who care about fit, finish, and service.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <blockquote
                className="rounded-[var(--radius)] border border-border bg-surface-elevated p-6 transition-[border-color,box-shadow] hover:border-primary hover:shadow-[var(--shadow-soft)]"
                key={testimonial.author}
              >
                <p className="text-sm leading-relaxed">{testimonial.quote}</p>
                <footer className="mt-6 border-t border-border pt-4 text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">{testimonial.author}</span> /{" "}
                  {testimonial.product}
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
