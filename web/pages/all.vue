<script setup>
const yews = ref([])

onMounted(async () => {
    const response = await fetch('https://api.brandon3.me/api/yews/fetch')
    let data = await response.json()
    const reconstructeds = []

    data.yews.forEach(day => {
      // split by - 
        const date = day.date.split('-')
        const reconstruction = `${date[0]} ${date[1]} ${date[2]}`

        if (reconstructeds.find(reconstructed => reconstructed.reconstructed === reconstruction)) {
            const index = reconstructeds.findIndex(reconstructed => reconstructed.reconstructed === reconstruction)
            console.log(reconstructeds[index])
            reconstructeds[index][date[3]] = day.articles
            return
        }
        
        const reconstructed = {
            reconstructed: reconstruction,
            yews: day.yews,
            date: day.date
        }
        
        reconstructed[date[3]] = day.articles

        reconstructeds.push(reconstructed)
    })

    reconstructeds.sort((a, b) => {
        // slice by dashes and keep the first 3 indexes
        const aDate = a.date.split('-')
        const aDateFormatted = `${aDate[0]}/${aDate[1]}/${aDate[2]}`
        const bDate = b.date.split('-')
        const bDateFormatted = `${bDate[0]}/${bDate[1]}/${bDate[2]}`

        return new Date(bDateFormatted) - new Date(aDateFormatted)
    })

    yews.value = reconstructeds
})

function enterDay(date) {
    navigateTo(`/yews/${date}`)
}

function format(date, time) {
  const dateSplit = date.split('-')
  const done = `${dateSplit[0]}-${dateSplit[1]}-${dateSplit[2]}-${time}`
  return done
}

</script>

<template>
  <div class="row" v-for="daily in yews" :key="daily.date">
    <p class="date">{{ daily.reconstructed }}</p>
    <p v-if="daily['10am']" @click="enterDay(format(daily.date, '10am'))" class="time">10AM</p>
    <p v-if="daily['3pm']" @click="enterDay(format(daily.date, '3pm'))" class="time">3PM</p>
    <p v-if="daily['8pm']" @click="enterDay(format(daily.date, '8pm'))" class="time">8PM</p>
  </div>
</template>

<style>
.row {
  display: flex;
  flex-direction: row;
  justify-content: left;
  background-color: #e9e9eb;
  margin-top: 10vh;
  text-align: left;
}

.date {
  font-size: 15px;
  margin: 0vh 20px;
  text-align: left;
}

.time {
  font-size: 15px;
  margin: 0vh 20px;
  cursor: pointer;
  text-align: left;
}



</style>