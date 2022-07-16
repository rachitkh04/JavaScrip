const fetchData = async (searchText) => {
    const responce = await axios.get('http://www.omdbapi.com/', {
        params: {
            apikey: '22720820',
            s: searchText
            //i: 'tt0848228'
        }
    })
    console.log(responce.data)
    //return responce.data.search[0];

}

//fetchData()
const input = document.querySelector('input')

// const onInput = event => {
//     if (timeoutId) {
//         clearTimeout(timeoutId);
//     }
//     timeoutId = setTimeout(() => {
//         console.log(event)
//         fetchData(event.target.value);
//     }, 1000)
// }



const debounce = (fun) => {
    let timeoutId;
    return (...args) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            console.log(args)
            fun.apply(null, args);
        }, 1000)
    }

}

const onInput = event => {
    fetchData(event.target.value);
}

input.addEventListener('input', debounce(onInput))
