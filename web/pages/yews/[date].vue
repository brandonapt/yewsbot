<script setup>
const route = useRoute()

const date = ref(route.params.date)
const yews = ref([])

onMounted(async () => {
  const response = await fetch(`https://api.brandon3.me/api/yews/${date.value}/get`)
  let data = await response.json()

  if (data.error) {
    navigateTo('/')
  }

  yews.value = data.yews.articles
})

function goback() {
  navigateTo('/')
}

function concatined(seperator, index) {
    const thing = route.params.date.split('-').slice(0, index).join(seperator)
    return thing
}

function toggleArticle(id) {
  const index = yews.value.findIndex(article => article._id === id)
  yews.value[index].toggled = !yews.value[index].toggled
}

function openArticle(date) {
  navigateTo('https://yews.news/edition/' + date, { open: { target: '_blank', }, external: true })
}
</script>

<template>
  <div>
    <p class="heading" @click="openArticle(date)">{{ concatined(' ', 3) }} - {{ route.params.date.split('-')[3] }}</p>
    <p @click="goback" class="goback">← GO BACK</p>
    <div class="article" v-for="article in yews" :key="article.title">
      <p class="title" @click="toggleArticle(article._id)">{{ article.title }}</p>
      <div class="row">
        <p class="contents" v-if="article.toggled">{{ article.contents }}</p>
        <img class="image" v-if="article.toggled" :src="article.image" alt="image" width="20%" />
      </div>
    </div>
  </div>
</template>

<style>
.goback {
    /* attach to bottom */
    position: fixed;
    bottom: 0;
    left: 0;
    margin: 5vh;
    padding: 0;
    cursor: pointer;
    background-color: #e9e9eb;
    padding: 10px;
    border: 1px solid black;
}

.row {
    display: flex;
    flex-direction: row;
    justify-content: left;
}

.heading {
    margin-top: 5vh;
    text-align: center;
    font-size: 2em;
    font-weight: 500;
    text-transform: uppercase;
    text-decoration: underline;
    text-decoration-thickness: 2px;
    cursor: pointer;
}

.article {
    margin-top: 5vh;
    padding: 5vh;
    background-color: #e9e9eb;
    text-align: left;
}

.title {
    font-size: 1.5em;
    font-weight: 500;
    margin: 0;
    cursor: pointer;
}

.contents {
    font-size: 1em;
    margin-top: 2vh;
    width: 40%;
}

.image {
    margin-top: 2vh;
    margin-left: 2vh;
}
</style>