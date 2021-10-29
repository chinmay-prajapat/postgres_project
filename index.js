const express = require("express");
const pg = require("pg");
const pool = new pg.Pool({
  host: "localhost",
  port: 5432,
  database: "socialnetwork",
  user: "postgres",
  password: "7894",
});
const app = express();
app.use(express.urlencoded({ extended: true }));
app.get("/posts", async (req, res) => {
  const { rows } = await pool.query(`
    select * from posts;
    `);
  res.send(`
<table>
<thead>
<tr>
<th>id</th>
<th>lng</th>
<th>lat</th>
</tr>
</thead>
<tbody>
${rows
  .map((row) => {
    return `
    <tr>
    <td>${row.id}</td>
    <td>${row.lng}</td>
    <td>${row.lat}</td>

    
    </tr>
    
    `;
  })
  .join("")}

</tbody>
</table>
<form method="post">
<h3>Create Post</h3>
<div>
<label>
Lng
</label>
<input name="lng"/>
</div>
<div>
<label>
Lat
</label>
<input name="lat"/>
</div>
<button type="submit">Create</button>
</form>
    `);
});
app.post("/posts", async (req, res) => {
  const { lng, lat } = req.body;
  await pool.query("Insert into posts(lat,lng,loc)values($1,$2,$3)", [
    lat,
    lng,
    `(${lng},${lat})`,
  ]);
  res.redirect("/posts");
});
app.listen(3005, () => {
  console.log("Port listing at 3005");
});