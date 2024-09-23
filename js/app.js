//Definir las variables o selectores
const carrito = document.querySelector('#carrito') /*Si esta como id hay que usar el # */
const listaCursos = document.querySelector('#lista-cursos');
const contenedorCarrito = document.querySelector('#lista-carrito tbody')
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito')

//pensar en que estructura vamos a guardar
let articulosCarritos = []; //declarando un arreglo vacio

//Definir los eventos o "listeners" que vamos a usar
cargarEventListener();
function cargarEventListener(){
    //click al boton de agregar al carrito
    listaCursos.addEventListener('click', agregarCurso);
    //elimina un curso del carrito
    carrito.addEventListener('click', eliminarCurso);
    //Vaciar carrito 
    vaciarCarritoBtn.addEventListener('click', ()=>{
        articulosCarritos = [];
        vaciarCarrito();
    });

    document.addEventListener('DOMContentLoaded', ()=>{
        articulosCarritos = JSON.parse(localStorage.getItem('articulosCarritos'))
        carritoHTML();
    });

}

//Definir las funciones a utilizar



function agregarCurso(e){
    e.preventDefault();
    //console.log('ingrese a la funcion agregarCurso')

    if(e.target.classList.contains('agregar-carrito')){
        const curso = e.target.parentElement.parentElement;
        leerDatosCurso(curso);
    }
}

function eliminarCurso(e){
    e.preventDefault();
    if(e.target.classList.contains('borrar-curso')){
        const cursoId = e.target.getAttribute('data-id');
        console.log(cursoId)

        const existe = articulosCarritos.some(cursos => cursos.id === cursoId);
        
        if(existe){
            const cursos = articulosCarritos.map(cursos =>{
                console.log(cursos.id)
                //primero verifico el Id para asegurar que haya encontrado el producto a eliminar
                if(cursos.id === cursoId){
                    //Luego si evaluo la cantidad de producto si la cant>1 entonces descuenta 1 y asi..
                    if(cursos.cantidad > 1){
                        cursos.cantidad--;
                        return cursos; //actualizamos objeto curso
                    }
                    else{
                        //caso base: cantidad = 1
                        articulosCarritos = articulosCarritos.filter(cursos => cursos.id !== cursoId)
                        return cursos;
                    }
                }
            })
        }

        carritoHTML();
        sincronizarStorage()
    }
}


function vaciarCarrito(){
    //forma lenta
    //contenedorCarrito.innerHTML = '';

    //forma rapida
    while(contenedorCarrito.firstChild){
        contenedorCarrito.removeChild(contenedorCarrito.firstChild);
    }
}

function leerDatosCurso(curso){
    const infoCurso ={
        imagen: curso.querySelector('img').src,
        titulo: curso.querySelector('h4').textContent,
        precio: curso.querySelector('.precio span').textContent,
        id: curso.querySelector('a').getAttribute('data-id'),
        cantidad:1 /*Todos los atributos llevan coma menos el ultimo*/
    }
    //Que pasa si ya tengo un articulo agregado al carrito? debo aumentar la cantidad, entonces:
    if(articulosCarritos.some(curso => curso.id ===infoCurso.id)){
        const cursos = articulosCarritos.map(curso =>{
            if(curso.id === infoCurso.id){
                //itero, visito cada posicion y si encuentro el id, entonces aumento en 1 la cantidad
                curso.cantidad++;
                return curso;
                //debo retornar la posicion completa porque map requiere que retorne el arreglo
            } else{
                return curso;
            }
        })

        articulosCarritos = [...cursos]
    }else{
        articulosCarritos = [...articulosCarritos,infoCurso];
    }
    //console.log(articulosCarritos)
    carritoHTML();

}

function carritoHTML(){
    vaciarCarrito();
    articulosCarritos.forEach(cursos =>{
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <img src="${cursos.imagen}" width=100>
            </td>
            <td>${cursos.titulo}</td>
            <td>${cursos.precio}</td>
            <td>${cursos.cantidad}</td>
            <td>
                <a href="#" class="borrar-curso" data-id="${cursos.id}">X</a>
            </td>

        `

        contenedorCarrito.appendChild(row);
    })
}

function sincronizarStorage(){
    localStorage.setItem('articulosCarritos',JSON.stringify(articulosCarritos));
}
