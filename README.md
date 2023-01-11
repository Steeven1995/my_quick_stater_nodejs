
# Description

Débuter un projet de zéros n'est pas chose facile. L'initialisation d'un projet from scratch  passe souvent par , le choix type de de base données, le choix de l'architecture des fichiers, gestion d'authentification et autorisation, envoie des mails etc. Des taches que nous effectuons tous les jours en tant que développeur. Sur ce dépôt, je vous présente mon Quick starter node js, express, prisma. Des fonctionnalités, basic seront intégré, et reste plus qu'à vous de modifier comme vous le souhaitez !

# Stack
Nodejs, express, prisma ORM, nodemail


## API Reference authentification
L'authentification est gerer avec les Json Web Token

#### Signup
J'ai implementé l'envoi de mail de confirmation avec node mailer

```http
   POST /api/auth/signup
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `email` | `string` | **Required**. |
| `password` | `string` | **Required**. |
| `name` | `string` | **Not required**. |



#### login
l'utilisateur ne peut pas s'authentifier tant que le compte n'est pas confirmé

```http
  POST /api/auth/login
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `email` | `string` | **Required**. |
| `password` | `string` | **Required**. |


#### forget password
Lorsque lorque l'utilisateur fait une demande de reinitialisation de mot de passe, une email est envoyé avec un token et une date d'expiration

```http
  POST /api/auth/forgot-password
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `email` | `string` | **Required**. |


#### Reset password
Une fois l'existence du token verifier le mot de passe est mis à jour dans la base de donnée

```http
  POST /api/auth/reset-password/:token
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `email` | `string` | **Required**. |



