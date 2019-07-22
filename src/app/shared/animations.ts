
import { trigger, style, state, transition, animate, animateChild, query } from "@angular/animations";

export const fade = trigger("fade", [
  state("void", style({
    opacity: 0,
    transform: "scale(0.9)"
  })),
  state("*", style({
    opacity: 1,
    transform: "scale(1)"
  })),
  transition("void <=> *", animate("0.5s ease-out"))
]);

export const fadeNoTransform = trigger("fadeNoTransform", [
  state("void", style({
    opacity: 0
  })),
  state("*", style({
    opacity: 1
  })),
  transition("void <=> *", animate("0.5s ease-out"))
]);

export const child = trigger("child", [
  transition("* => *", [
    query("@*", animateChild(), { optional: true })
  ])
]);
