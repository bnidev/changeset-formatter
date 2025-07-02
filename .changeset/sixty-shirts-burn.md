---
"changeset-formatter": patch
---

fix: Prevent potential [ReDoS](https://owasp.org/www-community/attacks/Regular_expression_Denial_of_Service_-_ReDoS) and performance issues by rejecting summary lines above 1000 characters
