import "./assets/styles/styles.scss";
import "./index.scss";
import { openModal } from "./assets/javascripts/modal";

const articleContainerElement = document.querySelector(".articles-container");
const categoriesContainerElement = document.querySelector(".categories");
const selectElement = document.querySelector("select");
let filter;
let articles;
let sortBy = 'asc';


selectElement.addEventListener("change", () => {
  sortBy = selectElement.value;
  fetchArticle(); //ici on invoc la fonction "fetchArticle" par rafrechir la page
})

// la Methode filter permet de litrer les article par categorie et ensuite de les affichers lorsque la 
// la categorie existe
const createArticles = () => {
  const articlesDOM = articles.filter(article => {
    if(filter){
       return article.category === filter;
    }else{
      return true;
    }
  }).map(article => {
    const articleDOM = document.createElement("div");
    articleDOM.classList.add("article");
    articleDOM.innerHTML = `
<img
  src="${article.img}"
  alt="profile"
/>
<h2>${article.title}</h2>                    
<p class="article-author">${article.author} - ${new Date(article.createdAt).toLocaleDateString("fr-FR",{
  weekday : 'long',  
  day : '2-digit',
  month : 'long',
  year : "numeric"
})}</p>
<p class="article-content">
  ${article.content}
</p>
<div class="article-actions">
  <button class="btn btn-danger" data-id=${article._id} >Supprimer</button>
  <button class="btn btn-primary" data-id=${article._id} >Modifier</button>
</div>
`;
return articleDOM;
  });
  articleContainerElement.innerHTML = "";
  articleContainerElement.append(...articlesDOM);
  const deleteButtons = articleContainerElement.querySelectorAll(".btn-danger");
  const editButton = articleContainerElement.querySelectorAll(".btn-primary");

  // pour basculer en mode edition quand ton click sur la button modifier
  editButton.forEach(button => {
    button.addEventListener("click", event => {
       const target = event.target; // pour recuperer la cible 
       const articleId = target.dataset.id; // pour récupérer Id de l'article cibler
       location.assign(`/form.html?id=${articleId}`); // une redirection vers article cibler 
    });
  });
  deleteButtons.forEach(button => {
    button.addEventListener("click", async event => {
        openModal('Etez vous sur de vouloir supprimer votre article');
    //     if(result === true){
    //       try {
    //         const target = event.target;
    //         const articleId = target.dataset.id;
    //         const response = await fetch(
    //           `https://restapi.fr/api/article/${articleId}`,
    //           {
    //             method: "DELETE"
    //           }
    //         );
    //         const body = await response.json();
    //     console.log(body);
    //     fetchArticle();
    //   } catch (e) {
    //     console.log("e : ", e);
    //   }
    // }    
    });
  });
};
// permet d'afficher le Menu categories
const displayMenuCategories = (categoriesArr) => {
  const liElements = categoriesArr.map(categoryElem => {
    const li = document.createElement("li");
    li.innerHTML = `${categoryElem[0]}(<strong>${categoryElem[1]}</strong>)`;
    if(categoryElem[0] === filter){
      li.classList.add('active');
    }
    li.addEventListener("click", () => {
      if(filter === categoryElem[0]){ //Nous permet de désélection la category déja séléctionner                          
        filter = null;                //En mettant le filter à null et ensuite de supprimer la classe active 
        li.classList.remove('active');// par remove('active')
        createArticles();
      }else{
        filter = categoryElem[0];
        liElements.forEach(li => { // "forEach" permet de parcourir chaque élement Li 
          li.classList.remove('active');
        })
        li.classList.add("active");
        createArticles();
      } 
    })
    return li;
  });
  categoriesContainerElement.innerHTML="";
  categoriesContainerElement.append(...liElements);
}

//La fonction createMenuCategories() va prendre les articles récupérées du serveur et va commencer par les
// transformer en objet avec la méthode reduce() que nous avions vue.
const createMenuCategories = () =>{
  const categories = articles.reduce((acc,article) => {
     if (acc[article.category]){
         acc[article.category] ++;
      } else{
        acc[article.category] = 1;
      }
      return acc ;
  },{});
  // creation dynamique du Menu Catégories
  const categoriesArr = Object.keys(categories).map((category) =>{
    return [category, categories[category]];
  })
  .sort((c1,c2) => c1[0].localeCompare(c2[0]));//la mehtode sort()permet de faire le trie par 
                  //lettre Alphabetique et le methode LocaleCompare() d'éffectuer une comparaison locale
  displayMenuCategories(categoriesArr); // permet d'afficher le Menu categories 
}

const fetchArticle = async () => {
    try {
      const response = await fetch(`https://restapi.fr/api/article?sort=createdAt:${sortBy}`);//Nous laissons au serveur le soin d'effectuer le tri cette fois-ci.
      articles = await response.json();                                   //à partir de la date de creation de l'article
      createArticles();
      createMenuCategories();
    } catch (e) {
      console.log("e :", e);
    }
  };
  
  fetchArticle();