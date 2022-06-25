// creating a function to make autocomplete reuseable
const createAutoComplete = ({
    root,
    renderOption,
    onOptionSelect,
    inputValue,
    fetchData
}) => {
    root.innerHTML = `
        <label><b>Search</b></label>
        <input class="input" />
        <div class = "dropdown">
        <div class = "dropdown-menu">
            <div class = "dropdown-content">
            
            </div>
        </div>
        </div>
    `;

    // selecting elements 
    const input = root.querySelector('input');
    const dropdown = root.querySelector('.dropdown')
    const result = root.querySelector('.dropdown-content')


    const onInput = async event => {
        const items = await fetchData(event.target.value);

        // closing dropdown if no data returned
        if (items.length == 0) {
            dropdown.classList.remove('is-active');
            return;
        }

        // resetting dropdown
        result.innerHTML = ``;

        // opening dropdown and adding data 
        dropdown.classList.add('is-active');
        for (let item of items) {
            const anchor = document.createElement('a');
            anchor.classList.add('dropdown-item');
            anchor.innerHTML = renderOption(item);
            //adding event listener when user select a item
            anchor.addEventListener('click', () => {
                dropdown.classList.remove('is-active');
                input.value = inputValue(item);
                onOptionSelect(item);
            })
            result.appendChild(anchor);
        }
        console.log(items)  // testing 
    };

    // closing dropdown if user clicks outside dropdown
    document.addEventListener('click', event => {
        if (!root.contains(event.target)) {
            dropdown.classList.remove('is-active')
        }
    })



    // adding delay in hitting the API
    input.addEventListener('input', debounce(onInput, 500));

}
