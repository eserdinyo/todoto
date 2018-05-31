// Locale Storage
const STORAGE_KEY = "todoto";
let todotoStorage = {
    fetch() {
        let todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        todos.forEach((todo, index) => {
            todo.id = index;
        })
        todotoStorage.uid = todos.length;
        return todos;
    },
    save(todos) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    }
}


// APP
new Vue({
    el: "#app",
    data() {
        return {
            per: null,
            rand: 43,
            options: {
                color: '#0097e6',
                trailColor: '#130f40',
                strokeWidth: 4,
                trailWidth: 4,
                duration: 500,

                text: {
                    value: "",
                    style: {
                        color: "#fff",
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        fontSize: "14px",
                        padding: 0,
                        margin: 0,
                        transform: {
                            prefix: true,
                            value: 'translate(-50%, -50%)'
                        }
                    }
                }
            },
            appName: "todoto",
            newTodo: "",
            todos: todotoStorage.fetch(),
            audio: new Audio("img/sound.mp3"),
        }
    },
    methods: {
        addTodo() {
            let value = this.newTodo && this.newTodo.trim();
            if (!value)
                return

            this.todos.push({
                id: todotoStorage.uid++,
                title: value,
            });
            this.newTodo = "";
        },
        removeTodo(todo) {
            this.todos.splice(this.todos.indexOf(todo), 1);
            this.audio.play();
        },
        getTime() {
            const now = new Date();
            const hour = now.getHours();
            const min = now.getMinutes();
            const percentage = (((hour + min / 60) - 7) * 100) / 17;

            if (hour < 7)
                percentage = 100;

            this.per = Math.floor(percentage);
            const final = this.per;
            document.addEventListener("DOMContentLoaded", function (event) {
                document.getElementsByClassName("progressbar-text")[0].innerHTML = "%" + final;
            });

            

        }
    },
    watch: {
        todos: {

            handler(todos) {
                todotoStorage.save(todos)
            },
            deep: true
        }
    },
    created() {
        this.getTime();
    },
    mounted() {
        this.$refs.line.animate("." + this.per)

    }
})

// TIME
new Vue({
    el: "#top",
    data() {
        return {

            hour: '',
            min: '',
            city: "",
            weather: "",
            weatherIcon: "",
            degree: "",
            lat: "",
            lon: "",
            weatherIcon: "",
            staticUrl: "img/back.jpg",
            imgUrl: "https://source.unsplash.com/collection/1977131/1920x1080/daily",
        }
    },
    methods: {
        getLocation() {
            var startPos;
            var geoSuccess = (position) => {
                startPos = position;
                this.lat = startPos.coords.latitude;
                this.lon = startPos.coords.longitude;

                if (this.lat != null && this.lat != null) {
                    this.getWeather(this.lat, this.lon);
                }

            };
            navigator.geolocation.getCurrentPosition(geoSuccess);
        },
        getWeather(lat, lon) {
            const url = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=7c7161304205564e512b8cb4bbb05bc4`;
            this.$http.get(url)
                .then(res => {
                    this.city = res.body.name;
                    this.degree = Math.ceil(res.body.main.temp);
                    this.weather = res.body.weather[0].description;
                    if (this.weather == "rain") {
                        this.weatherIcon = "img/weather_icons/rain.png";
                    } else if (this.weather == "snow") {
                        this.weatherIcon = "img/weather_icons/snow.png";
                    } else {
                        this.weatherIcon = "img/weather_icons/sun.png";
                    }


                }, res => {
                    console.log(res);
                });
        },
        setBackground() {
            let backDom = document.getElementById('header');



            backDom.style.backgroundImage = "linear-gradient(to top,rgba(0,0,0, .3) ,rgba(0,0,0, .1)), url(" + this.imgUrl + ") ";
            //document.getElementById('header').style.backgroundImage = "url(" + this.imgUrl + ")";
            backDom.style.backgroundPosition = "left";
            backDom.style.backgroundSize = "cover";
        },
        getTime() {
            const time = new Date();
            const getHour = time.getHours();
            const getMin = time.getMinutes();

            if (getHour < 10)
                this.hour = 0 + "" + getHour;
            else
                this.hour = getHour;
            if (getMin < 10)
                this.min = 0 + "" + getMin;
            else
                this.min = getMin;

            setInterval(() => {
                const time = new Date();
                const getHour = time.getHours();
                const getMin = time.getMinutes();

                if (getHour < 10)
                    this.hour = 0 + "" + getHour;
                else
                    this.hour = getHour;
                if (getMin < 10)
                    this.min = 0 + "" + getMin;
                else
                    this.min = getMin;
            }, 1000);
        }
    },
    computed: {

    },
    created() {
        this.getLocation();
        this.getTime();
        this.setBackground();
    },
    mounted() {
    }
})

// QUOTE
new Vue({
    el: "#quote",
    data() {
        return {
            quotes: [],
            quote: "",
            author: "",
            hour: "",
            minute: "",
            quoteID: "",
        }
    },
    methods: {
        getTime() {

            const now = new Date();
            const day = now.getDate();
            this.quoteID = day;


        }
    },
    created() {
        this.getTime();

        this.$http.get("https://todoso-53bad.firebaseio.com/quotes.json")
            .then(res => {
                this.quotes = res.body;
                this.quote = this.quotes[this.quoteID].quote;
                this.author = this.quotes[this.quoteID].author;
            }, res => {
                console.log(res);
            });
    }
})