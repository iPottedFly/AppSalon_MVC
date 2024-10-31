<?php

namespace Classes;

use PHPMailer\PHPMailer\PHPMailer;

class Email {

    public $email;
    public $nombre;
    public $token;
    public function __construct($email, $nombre, $token) {
        $this->email = $email;
        $this->nombre = $nombre;
        $this->token = $token;
    }

    public function enviarConfirmacion() {


        $phpmailer = new PHPMailer();
        $phpmailer->isSMTP();
        $phpmailer->Host = $_ENV['EMAIL_HOST'];
        $phpmailer->SMTPAuth = true;
        $phpmailer->Port = $_ENV['EMAIL_PORT'];
        $phpmailer->Username = $_ENV['EMAIL_USER'];
        $phpmailer->Password = $_ENV['EMAIL_PASSWORD'];

        $phpmailer->setFrom('cuentas@appsalon.com');
        $phpmailer->addAddress('cuentas@appsalon.com', 'AppSalon.com');
        $phpmailer->Subject = "Confirma tu Cuenta";

        // Set HTML
        $phpmailer->isHTML(TRUE);
        $phpmailer->CharSet = "UTF-8";

        $contenido = "<html>";
        $contenido.= "<p><strong>Hola " . $this->nombre . "</strong> Has Creado tu Cuenta en App Salon, solo debes confirmala presionando el siguiente enlace</p>";
        $contenido.= "<p>Presiona aquí: <a href='" .  $_ENV['APP_URL'] . "/confirmar-cuenta?token=" . $this->token . "'>Confirmar Cuenta</a></p>";
        $contenido.= "<p>Si tu no solicitaste esta cuenta, puedes ignorar el mensaje</p>";
        $contenido.= "</html>";
        $phpmailer->Body = $contenido;

        // Enviar el Email
        $phpmailer->send();
    }

    public function enviarInstrucciones() {
        $phpmailer = new PHPMailer();
        $phpmailer->isSMTP();
        $phpmailer->Host = $_ENV['EMAIL_HOST'];
        $phpmailer->SMTPAuth = true;
        $phpmailer->Port = $_ENV['EMAIL_PORT'];
        $phpmailer->Username = $_ENV['EMAIL_USER'];
        $phpmailer->Password = $_ENV['EMAIL_PASSWORD'];

        $phpmailer->setFrom('cuentas@appsalon.com');
        $phpmailer->addAddress('cuentas@appsalon.com', 'AppSalon.com');
        $phpmailer->Subject = "Recupera tu Cuenta";

        // Set HTML
        $phpmailer->isHTML(TRUE);
        $phpmailer->CharSet = "UTF-8";

        $contenido = "<html>";
        $contenido.= "<p><strong>Hola " . $this->nombre . "</strong> Has solicitado reestablecer tu password, click al enlace para hacerlo.</p>";
        $contenido.= "<p>Presiona aquí: <a href='" . $_ENV['APP_URL'] . "/recuperar?token=" . $this->token . "'>Recuperar Cuenta</a></p>";
        $contenido.= "<p>Si tu no solicitaste esta recuperacion, puedes ignorar el mensaje</p>";
        $contenido.= "</html>";
        $phpmailer->Body = $contenido;

        // Enviar el Email
        $phpmailer->send();
    }


}