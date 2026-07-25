// Dynamic SEO Schema.org Generator for Thanawiya Amma Results 2026

function injectSEOSchemas() {
  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "نتيجة الثانوية العامة 2026 - برقم الجلوس والاسم",
      "alternateName": "Thanawiya Amma Results 2026",
      "url": window.location.origin || "https://thanawaia-grades.com",
      "potentialAction": {
        "@type": "SearchAction",
        "target": (window.location.origin || "https://thanawaia-grades.com") + "/?roll={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      "headline": "موعد وتفاصيل نتيجة الثانوية العامة 2026 برقم الجلوس بالنظام الجديد 320 درجة",
      "description": "استعلم الآن عن نتيجة الثانوية العامة 2026 برقم الجلوس والاسم بالنظام الجديد المعدل 320 درجة، كشف درجات تفصيلي وتوقعات تنسيق الكليات.",
      "image": [
        "https://thanawaia-grades.com/assets/og-image.jpg"
      ],
      "datePublished": "2026-07-25T00:00:00+02:00",
      "dateModified": new Date().toISOString(),
      "author": {
        "@type": "Organization",
        "name": "منصة نتيجة الثانوية العامة"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "ما هو المجموع الكلي للثانوية العامة بالنظام الجديد 2026؟",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "المجموع الكلي للنظام الجديد في الثانوية العامة هو 320 درجة بدلاً من 410 درجة، مقسمة على 5 مواد أساسية مضافة للمجموع."
          }
        },
        {
          "@type": "Question",
          "name": "كيف يمكن الاستعلام عن نتيجة الثانوية العامة برقم الجلوس؟",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "قم بإدخال رقم الجلوس المكون من 7 أرقام في خانة البحث بالموقع واضغط على زر 'استعلم الآن' لتظهر شهادة الدرجات فوراً."
          }
        },
        {
          "@type": "Question",
          "name": "هل مادة اللغة الأجنبية الثانية مضافة للمجموع بالنظام الجديد؟",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "لا، أصبحت اللغة الأجنبية الثانية مادة نجاح ورسوب غير مضافة للمجموع الكلي بالنظام الجديد."
          }
        }
      ]
    }
  ];

  schemas.forEach(schemaData => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schemaData);
    document.head.appendChild(script);
  });
}

document.addEventListener('DOMContentLoaded', injectSEOSchemas);
