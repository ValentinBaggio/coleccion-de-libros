class Libro{
    constructor(titulo, autor, isbn){
        this.titulo=titulo;
        this.autor=autor;
        this.isbn=isbn;
    }
}

class UI{
    static mostrarLibros(){
        const libros=Datos.traerLibros();
        libros.forEach(libro => {
            UI.agregarLibroLista(libro)
        });
    }
    static agregarLibroLista(libro){
        const lista=document.querySelector('#libro-list');

        const fila=document.createElement('tr');
        fila.innerHTML=`
                        <td class='text-body'>${libro.titulo}</td>
                        <td class='text-body'>${libro.autor}</td>
                        <td class='text-body'>${libro.isbn}</td>
                        <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
                        `;

        lista.appendChild(fila);
    }
    static eliminarLibro(el){
        if(el.classList.contains('delete')){
            el.parentElement.parentElement.remove();
        }
    }
    static mostrarAlerta(msg, className){
        const div=document.createElement('div');
        div.className=`alert ${className}`;
        div.appendChild(document.createTextNode(msg));

        const container=document.querySelector('.container');
        const form=document.querySelector('#libro-form')
        container.insertBefore(div, form);

        setTimeout(()=>document.querySelector('.alert').remove(), 3000);
    }
    static limpiarCampos(){
        document.querySelector('#titulo').value='';
        document.querySelector('#autor').value='';
        document.querySelector('#isbn').value='';
    }
}

class Datos{
    static traerLibros(){
        let libros;
        if(localStorage.getItem('libros')===null){
            libros=[];
        }else{
            libros=JSON.parse(localStorage.getItem('libros'));
        }
        return libros;
    }
    static agregarLibro(libro){
        const libros=Datos.traerLibros();
        libros.push(libro);
        localStorage.setItem('libros', JSON.stringify(libros));
    }
    static removerLibro(isbn){
        const libros = Datos.traerLibros();
        libros.forEach((libro, index)=>{
            if(libro.isbn==isbn){
                libros.splice(index, 1);
            }
        });
        localStorage.setItem('libros', JSON.stringify(libros));
    }
}

//cargado de pagina
document.addEventListener('DOMContentLoaded', UI.mostrarLibros());

//controlar evento submit
document.querySelector('#libro-form').addEventListener('submit', (e)=>{
    e.preventDefault();

    //obtener valores
    const titulo=document.querySelector('#titulo').value;
    const autor=document.querySelector('#autor').value;
    const isbn=document.querySelector('#isbn').value;

    if(titulo===''||autor===''||isbn===''){
        UI.mostrarAlerta('Por favor ingrese todos los datos', 'text-danger');
    }else{
        const libro= new Libro(titulo,autor,isbn);
        Datos.agregarLibro(libro);
        UI.agregarLibroLista(libro);
        UI.mostrarAlerta('Libro agregado a la coleccion', 'text-success')
        UI.limpiarCampos();
    }
});

//eliminar libro

document.querySelector('#libro-list').addEventListener('click', (e)=>{
    UI.eliminarLibro(e.target);
    Datos.removerLibro(e.target.parentElement.previousElementSibling.textContent);
    UI.mostrarAlerta('Libro eliminado con exito', 'text-success')
})