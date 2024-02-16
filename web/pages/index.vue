<script setup>
function goto(path) {
    navigateTo(path)
}

function addBot() {
    navigateTo('https://discord.com/api/oauth2/authorize?client_id=1199544423223132240&permissions=10320&scope=bot%20applications.commands', { open: { target: '_blank', windowFeatures: { width: 500, height: 700 }}, external: true })
}
</script>

<template>
	<div>
		<h1 class="header">WELCOME TO YEWSBOT</h1>
		<div @click="goto('/today')" class="button">SEE TODAY</div>
		<div class="button" @click="goto('/all')">VIEW ARCHIVE</div>
		<div class="button" @click="addBot">DISCORD BOT</div>
	</div>
</template>

<style scoped>
.header {
	text-align: center;
	font-size: 3em;
	margin-top: 10vh;
    margin-bottom: 10vh;
}

.button {
    cursor: pointer;
    text-align: center;
    font-size: 2em;
    margin: 5vh;
    padding: 10px;
    background-color: #e9e9eb;
    border: 1px solid black;
    text-transform: uppercase;
    text-decoration: underline;
    text-decoration-thickness: 2px;
    width: 30%;
    margin: 0 auto; 
    margin-top: 5vh;
}
</style>
