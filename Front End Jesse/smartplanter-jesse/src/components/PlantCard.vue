<template>
  <article class="plants-position">
    <!-- Overlay -->
    <div class="overlay">
      <h2 class="title">
        <i class="fa-solid fa-seedling"></i>
        {{ name }}
      </h2>

      <div class="plant-position">
        <i class="fa-solid fa-location-dot"></i>
        <h1>{{ position }}</h1>
      </div>
    </div>

    <header class="plants-title">
      <h2 class="title">
        <i class="fa-solid fa-seedling"></i>
        {{ name }}
      </h2>
      
      <div class="plant-position">
        <i class="fa-solid fa-location-dot"></i>
        <h1>{{ position }}</h1>
      </div>
    </header>

    <section class="plant-info">
      <h1 class="daysToOogst"><strong>{{ daysToHarvest }}</strong> dagen tot oogst</h1>
      <div class="plantDate">
        <p>Geplant op:</p>
        <p>{{ plantDate }}</p>
      </div>
      <div class="plantOogst">
        <p>Oogst verwacht:</p>
        <p>{{ HarvestDate }}</p>
      </div>
    </section>

    <button class="btnOogst">Plant oogsten</button>
  </article>
</template>

<script>
export default {
  name: "PlantCard",
  props: {
    name: String,
    position: Number,
    daysToHarvest: Number,
    plantDate: Date,
    HarvestDate: Date,
  }
}
</script>

<style>
/*========== Plants Container =========*/
.plants-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 0.25fr));
  gap: 16px;
  padding: 20px 20px 0 20px;
  cursor: default;
}

/* Card styling */
.plants-position {
  position: relative; /* nodig voor overlay */
  flex-direction: column;
  background: var(--light);
  padding: 0.5rem 0 0 0;
  border-radius: 25px;
}

/* Overlay */
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--light);
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  border-radius: 25px;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.overlay h2 {
  margin-right: 1rem;
}

.plants-position:hover .overlay {
  opacity: 0;
}

/* Header styling */
.plants-title {
  display: flex;
  justify-content: space-between;
}

.title {
  display: flex;
  color: var(--text);
}

.title h2 {
  font-weight: 500;
  color: var(--text);
}

.title h1,
.title i {
  font-size: 2rem;
  color: var(--text);
}

/* Plant position badge */
.plant-position {
  display: flex;
  justify-content: center;   
  align-items: center;       
  min-width: 100px;         
  height: 2.5rem;            
  background: var(--primary);
  border-radius: 50px;
  box-sizing: border-box;    
}

/* Cijfers en iconen in de badge */
.plant-position h1,
.plant-position i {
  font-size: 2rem;       
  font-weight: 600;
  color: var(--text);
  margin: 0;               
  line-height: 1;          
}

/* Plant info */
.daysToOogst {
  font-size: 1.5rem;
  text-align: center; 
  padding: 0.5rem 0;  
  margin-bottom: 0.5rem; 
  color: var(--text);
}

.plantDate,
.plantOogst {
  display: flex;
  justify-content: space-between; 
  gap: 0.5rem; 
  font-size: 1.2rem;
  margin: 0rem 0.3rem 0rem 0.3rem;
  color: var(--text);
}

.plantDate p,
.plantOogst p {
  margin: 0; 

}
/* Button styling */
.btnOogst {
  background: var(--primary);
  color: var(--text);
  border-radius: 25px;
  height: 2.5rem;
  border: none;
  width: 90%;
  margin: 1rem 2rem 1rem 1rem;
  font-size: 2rem;
  font-weight: 600;
  cursor: pointer;
}

</style>
