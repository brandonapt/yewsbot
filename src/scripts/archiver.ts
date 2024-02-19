import bulkGetArticles from "../web/goons/bulkFetchArticles";

const startDate = new Date("2023-12-11");
const endDate = new Date();

async function archiver() {
  let currentDate = startDate;

  while (currentDate < endDate) {
    // Format date as m-d-y with hyphens
    let formattedDate = currentDate.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
    }).replace(/\//g, "-"); // Replace all slashes with hyphens

    // if the date starts with a 0, remove it
    if (formattedDate.startsWith("0")) {
      formattedDate = formattedDate.slice(1);
    }

    // if the date has a 0 after the first hyphen, remove it
    if (formattedDate.includes("-0")) {
      formattedDate = formattedDate.replace("-0", "-");
    }

    // Fetch articles with formatted date
    await bulkGetArticles(formattedDate + "-10am", true);
    await setTimeout(() => {
      console.log(`Archived articles for ${formattedDate}-10am`);
    }, 1000);
    await bulkGetArticles(formattedDate + "-3pm", true);
    await setTimeout(() => {
      console.log(`Archived articles for ${formattedDate}-3pm`);
    }, 1000);
    await bulkGetArticles(formattedDate + "-8pm", true);
    await setTimeout(() => {
      console.log(`Archived articles for ${formattedDate}-8pm`);
    }, 1000);


    await console.log(`Archived articles for ${formattedDate}`);

    // Increment date
    await currentDate.setDate(currentDate.getDate() + 1);
  }

  console.log("Archiving complete!");
}

export default archiver;
