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
    accountsAmount = accountsCount ? Math.ceil(accountsCount / accountsPerPage) + 1 : 0;
    const $buttonsContainer = document.querySelector('.pagination-buttons');
    const childButtonsCount = $buttonsContainer.children.length;
    let paginationButtonsHtml = '';

    for (let i = 1; i < accountsAmount; i++) {
        paginationButtonsHtml += `<button value="${i - 1}">${i}</button>`
    }

    if (childButtonsCount !== 0) {
        Array.from($buttonsContainer.children).forEach(node => node.remove())
    }

    $buttonsContainer.insertAdjacentHTML('beforeend', paginationButtonsHtml)
    Array.from($buttonsContainer.children).forEach(button => button.addEventListener('click', onPageChange))
}

function onPageChange(e) {
    currentPageNumber = e.target.value;
    fillTable(currentPageNumber, accountsPerPage)
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

/*
let accountsCount = 0;
let currentPageNumber = 0;
let accountsPerPage = 3;


$(function () {
    updateAccountsTable()
    updateAccountsCount()
    createAccountPerPageDropDown()
});

function updateAccountsTable() {

    $.get(`http://localhost:8080/rest/players?pageNumber=${currentPageNumber}&pageSize=${accountsPerPage}`, (accounts) => {
        const $tableBody = document.querySelector('.accounts-table-body');

        $tableBody.innerHTML = '';
        accounts.forEach(account => {
            $tableBody.insertAdjacentHTML('beforeend', createTableRow(account))
        })
    })
}

function createSelectOptions(numbers, defaultValue) {
    return numbers.map(num =>
        `<option ${num === defaultValue ? 'selected' : ''} value="${num}">${num}</option>`
    ).join('');
}

function createAccountPerPageDropDown() {
    const $dropDown = document.querySelector('#accounts-per-page');
    const options = createSelectOptions([3, 5, 10, 20], accountsPerPage)
    $dropDown.addEventListener('change', onAccountsPerPageChangeHandler)
    $dropDown.insertAdjacentHTML('afterbegin', options)
}

function updatePaginationButtons() {
    const buttonCount = accountsCount ? Math.ceil(accountsCount / accountsPerPage) : 0;
    const $paginationButtons = document.querySelector('.pagination-buttons');

    $paginationButtons.innerHTML = '';
    let paginationButtonsHtml = '';

    for (let i = 1; i < buttonCount; i++) {
        paginationButtonsHtml += `<button value="${i - 1}">${i}</button>`
    }

    $paginationButtons.insertAdjacentHTML('beforeend', paginationButtonsHtml);

    Array.from($paginationButtons.children).forEach(button => button.addEventListener('click', paginationButtonHandler))
}

function updateAccountsCount() {
    $.get(`http://localhost:8080/rest/players/count`, (count) => {
        accountsCount = count;
        updatePaginationButtons()
    })
}

function paginationButtonHandler(e) {
    currentPageNumber = e.target.value;
    updateAccountsTable();
}

function onAccountsPerPageChangeHandler(e) {
    accountsPerPage = e.target.value;
    updateAccountsTable();
    updatePaginationButtons();
}

function createTableRow(account) {
    return `<tr class="row">
                <td>${account.id}</td>
                <td>${account.name}</td>
                <td>${account.title}</td>
                <td>${account.race}</td>
                <td>${account.profession}</td>
                <td>${account.level}</td>
                <td>${account.birthday}</td>
                <td>${account.banned}</td>
                <td><button onclick="editAccount(${account.id})">Edit</button></td>
                <td><button onclick="deleteAccount(${account.id})">Delete</button></td>
            </tr>`;
}

function deleteAccount(id) {
    // Видаляємо обліковий запис
    $.ajax({
        url: `http://localhost:8080/rest/players/${id}`,
        type: 'DELETE',
        success: () => updateAccountsTable()
    });
}
*/
