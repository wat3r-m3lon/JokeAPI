import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const API_URL = "https://v2.jokeapi.dev";

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('index.ejs', { joke: [], error: null });
});

app.post('/get-joke',async(req,res)=>{
    console.log(req.body);
    const category=req.body.category;
    const lang =req.body.lang;
    const blacklistFlags = req.body.blacklistFlags;
    const amount=req.body.amount;
    try{
        const response = await axios.get(`${API_URL}/joke/${category}?lang=${lang}&blacklistFlags=${blacklistFlags}&amount=${amount}`);
        const joke = response.data;
        console.log(joke);

        const jokeData = response.data.jokes ? response.data.jokes : [response.data]; 
        // Always handle jokes as an array
// esponse.data.jokes: This checks if the jokes field exists in the response data (which happens when you request multiple jokes).
// If response.data.jokes exists (i.e., it’s true): The value of jokeData will be response.data.jokes (an array of jokes).
// If response.data.jokes doesn't exist (i.e., it’s false): The value of jokeData will be [response.data], meaning we take the entire response.data object (a single joke) and wrap it inside an array.

        // Format jokes to be sent to the template
        let formattedJokes = [];
        for (let joke of jokeData) {
            if (joke.type === 'single') {
                formattedJokes.push(joke.joke); // For single-type jokes
            } else if (joke.type === 'twopart') {
                formattedJokes.push(`${joke.setup} ... ${joke.delivery}`); // For two-part jokes
            }
        }

        res.render("index.ejs", { joke: formattedJokes, error: null });
    } catch (error) {
        console.error('Error fetching joke:', error);
        res.render("index.ejs", { joke: null, error: 'Error fetching joke, please try again.' });
    }

});

app.listen(port, ()=>{
    console.log(`server is running on port ${port}`)
});
