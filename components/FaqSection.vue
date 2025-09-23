<script setup></script>

<template>
  <div class="container mb-5">
    <div class="wrapper pt-4 pb-5">
      <div class="container-fluid">
        <p class="text-center top-title">
          سوالات
          <span class="green-back">پرتکرار</span>
          پرسیده شده
        </p>
        <!-- faq section  -->
        <div class="accordion accordion-flush" id="accordionFlushExample">
          <div class="accordion-item">
            <h2 class="accordion-header" id="flush-headingOne">
              <button
                class="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#flush-collapseOne"
                aria-expanded="false"
                aria-controls="flush-collapseOne"
              >
                1- چه خدماتی ارائه می دهید؟
              </button>
            </h2>
            <div
              id="flush-collapseOne"
              class="accordion-collapse collapse"
              aria-labelledby="flush-headingOne"
              data-bs-parent="#accordionFlushExample"
            >
              <p class="accordion-body">
                خدمات 360 درجه استارتاپ ما طیف وسیعی از خدمات در زمینه های مختلف
                از جمله طراحی سایت, طراحی رابط کاربری, خدمات دیجیتال مارکتینگ,
                سئو ,شبکه های اجتماعی و … را ارائه می دهد. در واقع ما صفر تا صد
                خدمات دیجیتالی شما را پیاده سازی و انجام میدهیم.
              </p>
            </div>
          </div>
          <hr class="divider" />
          <div class="accordion-item">
            <h2 class="accordion-header" id="flush-headingTwo">
              <button
                class="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#flush-collapseTwo"
                aria-expanded="false"
                aria-controls="flush-collapseTwo"
              >
                2- هزینه خدمات شما چقدر است؟
              </button>
            </h2>
            <div
              id="flush-collapseTwo"
              class="accordion-collapse collapse"
              aria-labelledby="flush-headingTwo"
              data-bs-parent="#accordionFlushExample"
            >
              <p class="accordion-body">
                هزینه خدمات ما به نوع خدمتی که درخواست می کنید متفاوت خواهد بود.
                با این حال ما معتقد به ارائه خدمات با کیفیت به قیمتی مناسب
                هستیم. شما میتوانید برای دریافت برآورد دقیق تر از هزینه خدمات ما
                با ما تماس بگیرید .
              </p>
            </div>
          </div>
          <hr class="divider" />
          <div class="accordion-item">
            <h2 class="accordion-header" id="flush-headingThree">
              <button
                class="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#flush-collapseThree"
                aria-expanded="false"
                aria-controls="flush-collapseThree"
              >
                3- نمونه کارهای شما را چگونه ببینم؟
              </button>
            </h2>
            <div
              id="flush-collapseThree"
              class="accordion-collapse collapse"
              aria-labelledby="flush-headingThree"
              data-bs-parent="#accordionFlushExample"
            >
              <p class="accordion-body">
                شما می توانید نمونه کار های ما را در وب سایت و بخش خدمات و
                محصولات مشاهده کنید. همچنین می توانید برای دریافت نمونه کار های
                بیشتر با ما تماس بگیرید.
              </p>
            </div>
          </div>
          <hr class="divider" />
          <div class="accordion-item">
            <h2 class="accordion-header" id="flush-headingFour">
              <button
                class="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#flush-collapseFour"
                aria-expanded="false"
                aria-controls="flush-collapseFour"
              >
                4- برای سفارش خدمات چکار باید بکنم؟
              </button>
            </h2>
            <div
              id="flush-collapseFour"
              class="accordion-collapse collapse"
              aria-labelledby="flush-headingFour"
              data-bs-parent="#accordionFlushExample"
            >
              <p class="accordion-body">
                همین حالا به صفحه تماس با ما رفته و با کارشناسان ما تماس
                بگیرید و سفارش خود را ثبت نمائید.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.wrapper {
  background: var(--background-secondary-color);
  border-radius: var(--border-radius-xl);
  .top-title {
    font-size: 140%;
    font-weight: bold;
    margin-bottom: 22px;
    .green-back {
      background: var(--primary-color);
      border-radius: var(--border-radius-sm);
      padding: 4px 8px;
    }
  }

  // faq
  hr {
    margin: 0 20px !important;
  }
  .accordion-item {
    background-color: var(--background-secondary-color);
    border: none !important;

    .accordion-body {
      color: rgb(100, 100, 100) !important;
    }
    h2 {
      font-size: 110%;
      line-height: 32px;

      .accordion-button {
        border: none !important;

        background-color: var(--background-secondary-color);
        font-size: 110%;
        font-weight: normal;
        color: var(--text-primary-color);

        @media (min-width: 992px) {
          font-weight: bold;
        }
      }
    }
  }
}
</style>
