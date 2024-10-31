<div class="barra">
    <p>
        Hola: <?php echo $nombre ?? ''; ?>
    </p>
    <a href="/logout" class="boton">Cerrar Sesión</a>
</div>

<?php if(isset($_SESSION['admin'])) { ?>
    <div class="barra-servicios">
        <a href="/admin" class="boton">Ver Citas</a>
        <a href="/admin/servicios" class="boton">Ver servicios</a>
        <a href="/admin/servicios/crear" class="boton">Crear Servicio</a>
    </div>
<?php } else { ?>

<?php } ?>
