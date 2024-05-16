let accountsCount = null;
let accountsPerPage = 3;
let accountsAmount = null;
let currentPageNumber = 0;

$(function () {
    fillTable(currentPageNumber, accountsPerPage)
    updatePlayersCount()
    createAccountPerPageDropDown()
});


function fillTable(pageNumber, pageSize) {
    $.get(`http://localhost:8080/rest/players?pageNumber=${pageNumber}&pageSize=${pageSize}`, (players) => {
        console.log(players);

        const $playersTableBody = $('.players-table-body')[0];
        let htmlRows = '';

        players.forEach((player) => {
            htmlRows +=
                `<tr>
                    <td class="cell">${player.id}</td>
                    <td class="cell">${player.name}</td>
                    <td class="cell">${player.title}</td>
                    <td class="cell">${player.race}</td>
                    <td class="cell">${player.profession}</td>
                    <td class="cell">${player.level}</td>
                    <td class="cell">${player.birthday}</td>
                    <td class="cell">${player.banned}</td>
                    <td class="cell">
                        <button class="edit-button">
                            <img src="../img/edit.png" alt="edit">
                        </button>
                    </td>
                    <td class="cell">
                    <button class="delete-button">
                            <img src="../img/delete.png" alt="delete">
                        </button>
                    </td>
                </tr>`
        })

        Array.from($playersTableBody.children).forEach(row => row.remove());

        $playersTableBody.insertAdjacentHTML('beforeend', htmlRows);
    })
}

function updatePlayersCount() {
    $.get(`/rest/players/count`, (count) => {
        accountsCount = count;
        updatePaginationButtons()
    })
}

function updatePaginationButtons() {
    accountsAmount = accountsCount ? Math.ceil(accountsCount / accountsPerPage) : 0;
    const $buttonsContainer = document.querySelector('.pagination-buttons');
    const childButtonsCount = $buttonsContainer.children.length;
    let paginationButtonsHtml = '';

    for (let i = 1; i <= accountsAmount; i++) {
        paginationButtonsHtml += `<button value="${i - 1}">${i}</button>`
    }

    if (childButtonsCount !== 0) {
        Array.from($buttonsContainer.children).forEach(node => node.remove())
    }

    $buttonsContainer.insertAdjacentHTML('beforeend', paginationButtonsHtml)
    Array.from($buttonsContainer.children).forEach(button => button.addEventListener('click', onPageChange))
    setActiveButton(currentPageNumber)
}

function createAccountPerPageDropDown() {
    const $dropDown = document.querySelector('.accounts-per-page');
    const options = createSelectOptions([3, 5, 10, 20], accountsPerPage)
    $dropDown.addEventListener('change', onAccountsPerPageChangeHandler)
    $dropDown.insertAdjacentHTML('afterbegin', options)
}

function createSelectOptions(optionsArray, defaultValue) {
    let optionHtml = '';

    optionsArray.forEach(option => optionHtml +=
        `<option ${defaultValue === option && 'selected'} value="${option}">
            ${option}
        </option>`)

    return optionHtml;
}

function onAccountsPerPageChangeHandler(e) {
    accountsPerPage = e.target.value;
    fillTable(currentPageNumber, accountsPerPage);
    updatePaginationButtons();
}

function onPageChange(e) {
    const targetPageIndex = e.target.value;
    setActiveButton(targetPageIndex)
    currentPageNumber = e.target.value;
    fillTable(currentPageNumber, accountsPerPage)
    setActiveButton(currentPageNumber)
}

function setActiveButton(buttonIndex = 0) {
    const $buttonContainer = document.querySelector('.pagination-buttons');
    const $targetButton = Array.from($buttonContainer.children)[buttonIndex];
    const $currentActiveButton = Array.from($buttonContainer.children)[currentPageNumber];

    $currentActiveButton.classList.remove('active-pagination-button')
    $targetButton.classList.add('active-pagination-button');
}
