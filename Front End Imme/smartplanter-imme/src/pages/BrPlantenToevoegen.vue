<template>

    <div class="plantToevoegen">
        <p class="testPlant">Test scherm</p>
        <table class="plantToevoegTabel">
            <thead>
                <tr>
                    <th>test</th>
                    <th>Test2</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Invul</td>
                    <td>Invul2</td>
                </tr>
            </tbody>
        </table>
    </div>

</template>

<script>
export default {
  name: 'PlantToevoegenAdminPagina',
}


</script>

<style>
.plantToevoegTabel{
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.plantToevoegTabel th {
  text-align: left;
  padding: 12px 8px;
  border-bottom: 2px solid #a7d3bf;
}

.plantToevoegTabel td {
  padding: 12px 8px;
  border-bottom: 1px solid #eee;
}

.testPlant {
    color:black;
}

.plantToevoegen {
    background: white;
    padding: 20px;
    width: 90%;
    margin-left: 5%;
    border-radius: 10px;
    margin-bottom: 20px;
    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    overflow-y: auto;
}

</style>