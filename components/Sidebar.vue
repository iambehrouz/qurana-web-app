<script>
import { onMounted, ref } from "vue";
import { usePostsStore } from "../stores/posts";

export default {
  setup(props) {
    const postsStore = usePostsStore();
    const sidebarSettings = ref({
      quickAccess: {
        title: "دسترسی سریع",
        items: [
          {
            text: "صفحه اصلی",
            link: "/",
          },

          {
            text: "بلاگ",
            link: "/blog",
          },
          {
            text: " اطلاعات تماس ",
            link: "/contacts",
          },
          {
            text: " درباره مجموعه ",
            link: "/about",
          },
        ],
      },
      about: {
        title: "درباره نبض",
        description:
          "این یک متن آزمایشی می باشد که باید با محتوای واقعی جایگزین شود. این یک متن آزمایشی می باشد که باید با محتوای واقعی جایگزین شود. این یک متن آزمایشی می باشد که باید با محتوای واقعی جایگزین شود.مایشی می باشد که باید با محتوای واقعی جایگزین شود.",
      },
    });
    const posts = ref({
      filter: {
        query: {
          postId: null,
          isActive: true,
        },
        limit: 4,
        order: "newest",
      },
      items: [],
    });
    const getPosts = async () => {
      const { items } = await postsStore.get(posts.value.filter);
      posts.value.items = items;
    };
    onMounted(() => {
      getPosts();
    });
    return {
      sidebarSettings,
      posts,
    };
  },
};
</script>
<template>
  <div class="sidebar">
    <div class="sidebar-quick-access">
      <div class="box-header d-flex justify-content-between">
        <span class="fw-bold">{{ sidebarSettings.quickAccess.title }}</span>
        <i class="fa fa-quote-left"></i>
      </div>
      <div class="box-body">
        <ul>
          <li
            v-for="(item, index) in sidebarSettings.quickAccess.items"
            :key="index"
          >
            <a :href="item.link" class="d-flex justify-content-between">
              <span>
                <i class="fa fa-chevron-left ps-1"></i>
                {{ item.text }}
              </span>
              <i class="fa fa-external-link link-icon"></i
            ></a>
          </li>
        </ul>
      </div>
    </div>
    <div class="sidebar-blog-posts">
      <div class="box-header d-flex justify-content-between">
        <span class="fw-bold">مطالب پربازدید</span>
        <i class="fa fa-quote-left"></i>
      </div>
      <div class="box-body">
        <ul>
          <li v-for="(item, index) in posts.items">
            <a
              :href="`/blog/posts/${item.postId}`"
              target="_blank"
              class="d-flex justify-content-between"
            >
              <span>
                <i class="fa fa-file-alt ps-1"></i>
                {{ item.title }}
              </span>
              <span class="link-icon">{{ index + 1 }}</span></a
            >
          </li>
          <!-- <li>
            <a href="#" class="d-flex justify-content-between">
              <span>
                <i class="fa fa-file-alt ps-1"></i>
                لورم ایپسوم متن ساختگی
              </span>
              <span class="link-icon">2</span></a
            >
          </li> -->
        </ul>
      </div>
    </div>
    <div class="sidebar-about">
      <div class="box-header d-flex justify-content-between">
        <span class="fw-bold">{{ sidebarSettings.about.title }}</span>
        <i class="fa fa-quote-left"></i>
      </div>
      <div class="box-body">
        <p>
          {{ sidebarSettings.about.description }}
        </p>
      </div>
    </div>
  </div>
</template>
