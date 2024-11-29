async function getWorks() {
  try {
    const response = await fetch('http://localhost:5678/api/works');
    const works = await response.json();
    console.log(works);
  } catch (error) {
    console.error(`Une erreur est survenue : ${error}`);
  }
}

getWorks();
