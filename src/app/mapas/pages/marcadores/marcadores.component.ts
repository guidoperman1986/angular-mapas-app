import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

interface MarcadorColor {
  color: string;
  marker?: mapboxgl.Marker,
  centro?: [number, number];
}

@Component({
  selector: 'app-marcadores',
  templateUrl: './marcadores.component.html',
  styleUrls: ['./marcadores.component.css']
})
export class MarcadoresComponent implements OnInit, AfterViewInit {
  @ViewChild('mapa') divMapa!: ElementRef;
  mapa!: mapboxgl.Map;
  zoomLevel: number = 15;
  center: [number, number] = [-58.407021798173936, -34.59763419724786]

  //Arreglo de marcadores
  marcadores: MarcadorColor[] = [];

  constructor() { }

  
  ngOnInit(): void {
  }
  
  ngAfterViewInit(): void {
    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      zoom: this.zoomLevel,
      center: this.center,
    });

    this.leerMarcadoresLocalStorage();

    /* const markerHtml: HTMLElement = document.createElement('div');
    markerHtml.innerHTML = 'Hola Mundo'; */
    

    /* new mapboxgl.Marker()
                .setLngLat(this.center)
                .addTo(this.mapa); */
  }

  irMarcador(marcador: mapboxgl.Marker){
    this.mapa.flyTo({
      center: marcador.getLngLat()
    })
  }

  agregarMarcador(){
    const color = "#xxxxxx".replace(/x/g, y=>(Math.random()*16|0).toString(16));
    const nuevoMarcador = new mapboxgl.Marker({
                                draggable: true,
                                color
                              })
                              .setLngLat(this.center)
                              .addTo(this.mapa);

    this.marcadores.push({marker: nuevoMarcador, color});      
    
    this.guardarMarcadorLocalStorage();

    nuevoMarcador.on('dragend', ()=>{
      this.guardarMarcadorLocalStorage();
    });
  }

  guardarMarcadorLocalStorage(){
    const lngLatArr: MarcadorColor[] = [];
    this.marcadores.forEach(m => {
      const color = m.color;
      const { lng, lat } = m.marker!.getLngLat()

      lngLatArr.push({
        color,
        centro: [lng, lat]
      })
    })

    localStorage.setItem('marcadores', JSON.stringify(lngLatArr));
  }

  leerMarcadoresLocalStorage() {
    if (!localStorage.getItem('marcadores')) {
      return;
    }

    const lngLatArr: MarcadorColor[] = JSON.parse(localStorage.getItem('marcadores')!);

    lngLatArr.forEach(m=>{
      const newMaker = new mapboxgl.Marker({
        color: m.color,
        draggable: true
      })
      .setLngLat(m.centro!)
      .addTo(this.mapa)

      this.marcadores.push({
        marker: newMaker,
        color: m.color
      })

      newMaker.on('dragend', ()=>{
        this.guardarMarcadorLocalStorage();
      });
    });
    
  }

  borrarMarcador(i: number){
    this.marcadores[i].marker?.remove();
    this.marcadores.splice(i,1);
    this.guardarMarcadorLocalStorage();
  }
}
