const $container = document.querySelector('.content_left');
const GetApi = (id , method, body, query, cb) => {
    baseUrl = `http://2.57.186.103:5000/api/posts/${id}?${query}`
    const xhr = new XMLHttpRequest();
    xhr.open(method , baseUrl);
    xhr.addEventListener('load' ,() => {
        const response = JSON.parse(xhr.response);
        cb(response);
    })
    if(method === 'POST' || method === 'PUT'){
        xhr.setRequestHeader('Content-type' , 'application/json')
    }
    xhr.addEventListener('error' , err => {
    console.log(err);
    console.log('error 404');
    })
    xhr.send(JSON.stringify(body));
}
window.addEventListener('load' , () => {
    GetApi('' , 'GET', null, '', res => {
        console.log(res);
        if(res?.length === 0){
            $container.innerHTML = `<p>Пусто</p>`
        }else{
            const cont = res.data.map(item => CardTemp(item)).join(' ');
            $container.innerHTML = cont
        }
    });
});
function CardTemp({title ,body,date,author,_id,img}){
    return `
    <div class="card">
        <div class="card_top">
            <h1>${title}</h1>
        </div>
        <div class="card_main">
            <p>${body}</p>
        </div>
        <div class="card_header">
            <div><span class="blog_date">${date}</span></div>
            <div><span class="blog_user">${author}</span></div>
        </div>
        <div class="bottom_btn">
            <button class="btn_delete" onclick="deleteBlog('${_id}')">Delete</button>
            <button class="btn_delete" onclick="editBlog('${_id,title,body,author,img}')">Edit</button>
        </div>
    </div>
    `
}
const $inputAuthor = document.querySelector('.inputAuthor');
const $inputTitle = document.querySelector('.inputTitle');
const $InputImg = document.querySelector('.InputImg');
const $area_cont = document.querySelector('.area_cont');
const $submit = document.querySelector('.submit');
$submit.addEventListener('click' , e => {
    e.preventDefault();
    if($inputAuthor.value && $inputTitle.value && $InputImg.value && $area_cont.value){
        if($area_cont.value.length > 100){
            alert('Не больше 100 символов')
        }else{
            GetApi('','POST',
            {   title: $inputTitle.value,
                body: $area_cont.value,
                author: $inputAuthor.value,
                date: new Date(),
            },
            '',res => {
                window.location.reload()
            })
        }
    }else{
        alert('Не все поля заполнены')
    }
})

function deleteBlog(id){
    const askDelete = confirm('Realy?');
    if(askDelete){
        GetApi(
            id,
            'DELETE',
            null,
            "",
            res => {
                location.reload()
            }
            )
    }
}

function editBlog(id){
    const askConf = confirm('Realy?');
    if(askConf){
        GetApi(
        '',
        'PUT',
        {
            _id: id,
            title: prompt('new, title'),
            body: prompt('new, body'),
            author: prompt('new, author'),
            img: prompt('new, img'),
        },
        "",
        res => {
            window.location.reload()
            console.log(res);
        }
        )
    }
}