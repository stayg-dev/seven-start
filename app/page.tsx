"use client";

import { useEffect } from "react";
import { pageContent } from "./page-content";

const messages: Record<string, string> = {
  ko: "예약 문의가 정상적으로 접수되었습니다. 영업일 기준 24시간 이내에 담당자가 회신드리겠습니다.",
  en: "Your reservation enquiry has been received. Our team will respond within 24 business hours.",
  mn: "Таны захиалгын хүсэлт амжилттай хүлээн авагдлаа. Ажлын 24 цагийн дотор хариу өгөх болно.",
  zh: "您的预订咨询已成功提交，我们的工作人员将在24小时内（工作日）回复您。",
};

export default function Home() {
  useEffect(() => {
    const cleanups: Array<() => void> = [];
    const languageButtons = Array.from(
      document.querySelectorAll<HTMLButtonElement>(".lang-switch button"),
    );

    const changeLanguage = (language: string, button: HTMLButtonElement) => {
      languageButtons.forEach((item) => item.classList.remove("active"));
      button.classList.add("active");

      document.querySelectorAll<HTMLElement>(".lang-text").forEach((element) => {
        const translatedText = element.dataset[language];
        if (translatedText) element.innerText = translatedText;
      });
      document.documentElement.lang = language;
    };

    languageButtons.forEach((button) => {
      const onClick = () => changeLanguage(button.dataset.lang ?? "ko", button);
      button.addEventListener("click", onClick);
      cleanups.push(() => button.removeEventListener("click", onClick));
    });

    const header = document.getElementById("header");
    const onScroll = () => header?.classList.toggle("scrolled", window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    cleanups.push(() => window.removeEventListener("scroll", onScroll));

    const slides = Array.from(document.querySelectorAll<HTMLElement>(".hero-slide"));
    const copies = Array.from(document.querySelectorAll<HTMLElement>(".hero-copy"));
    const indicators = Array.from(
      document.querySelectorAll<HTMLButtonElement>(".hero-indicators button"),
    );
    let currentSlide = 0;
    let timer: ReturnType<typeof setInterval> | undefined;

    const goToSlide = (index: number) => {
      currentSlide = (index + slides.length) % slides.length;
      slides.forEach((slide, i) => slide.classList.toggle("active", i === currentSlide));
      copies.forEach((copy, i) => copy.classList.toggle("active", i === currentSlide));
      indicators.forEach((indicator, i) =>
        indicator.classList.toggle("active", i === currentSlide),
      );
    };
    const startAutoplay = () => {
      if (timer) clearInterval(timer);
      if (slides.length) timer = setInterval(() => goToSlide(currentSlide + 1), 6000);
    };

    indicators.forEach((button, index) => {
      const onClick = () => {
        goToSlide(index);
        startAutoplay();
      };
      button.addEventListener("click", onClick);
      cleanups.push(() => button.removeEventListener("click", onClick));
    });
    startAutoplay();
    cleanups.push(() => {
      if (timer) clearInterval(timer);
    });

    const form = document.querySelector<HTMLFormElement>("#reservationForm");
    const onSubmit = (event: SubmitEvent) => {
      event.preventDefault();
      const language =
        document.querySelector<HTMLButtonElement>(".lang-switch button.active")?.dataset
          .lang ?? "ko";
      window.alert(messages[language] ?? messages.ko);
      form?.reset();
    };
    form?.addEventListener("submit", onSubmit);
    cleanups.push(() => form?.removeEventListener("submit", onSubmit));

    const anchorLinks = Array.from(
      document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]'),
    );
    anchorLinks.forEach((anchor) => {
      const onClick = (event: MouseEvent) => {
        const target = anchor.hash.length > 1 ? document.querySelector(anchor.hash) : null;
        if (target) {
          event.preventDefault();
          target.scrollIntoView({ behavior: "smooth" });
        }
      };
      anchor.addEventListener("click", onClick);
      cleanups.push(() => anchor.removeEventListener("click", onClick));
    });

    return () => cleanups.forEach((cleanup) => cleanup());
  }, []);

  return <main dangerouslySetInnerHTML={{ __html: pageContent }} />;
}
