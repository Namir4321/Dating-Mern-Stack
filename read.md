# end points

# auth endpoint

-post /register
-post /login
-post /logout

# profile endpoint
-get /profile/view
-patch /profile/edit
-patch /profile/password


# connection request endpoints
status=>ignored,intrested
-post /request/send/status/:userId
status=>accepted,rejected
-post /request/review/status/:requestId

# userRouter
GET /user/connection
GET /user/request
GET /user/feed -Gets you the profile of other user on platform

#
