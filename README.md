
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



