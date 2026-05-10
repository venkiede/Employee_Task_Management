from rest_framework import generics, status
import traceback
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken
from django.contrib.auth import authenticate, get_user_model

from core.responses import success_response, created_response, error_response
from .serializers import (
    RegisterSerializer, LoginSerializer, UserSerializer,
    ProfileUpdateSerializer, ChangePasswordSerializer, UserListSerializer
)
from .permissions import IsAdmin

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    """Register a new user account."""

    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def options(self, request, *args, **kwargs):
        return success_response(message="OPTIONS allowed")

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Generate tokens for the new user
        refresh = RefreshToken.for_user(user)
        user_data = UserSerializer(user).data

        return created_response(
            data={
                'user': user_data,
                'tokens': {
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                }
            },
            message="Registration successful."
        )


class LoginView(APIView):
    """Authenticate user and return JWT tokens."""

    permission_classes = [AllowAny]
    serializer_class = LoginSerializer

    def options(self, request, *args, **kwargs):
        return success_response(message="OPTIONS allowed")

    def post(self, request):
        try:
            print("DEBUG: Login API HIT")
            print(f"DEBUG: Request Data: {request.data}")
            
            serializer = LoginSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            email = serializer.validated_data['email'].lower().strip()
            password = serializer.validated_data['password']

            print(f"DEBUG: Authenticating user: {email}")
            user = authenticate(request, email=email, password=password)

            if user is None:
                print("DEBUG: Authentication failed")
                return error_response(
                    message="Invalid email or password.",
                    status_code=status.HTTP_401_UNAUTHORIZED
                )

            if not user.is_active:
                print(f"DEBUG: User {email} is inactive")
                return error_response(
                    message="Your account has been deactivated.",
                    status_code=status.HTTP_403_FORBIDDEN
                )

            print(f"DEBUG: Login successful for user: {email}")
            refresh = RefreshToken.for_user(user)
            user_data = UserSerializer(user).data

            return success_response(
                data={
                    'user': user_data,
                    'tokens': {
                        'access': str(refresh.access_token),
                        'refresh': str(refresh),
                    }
                },
                message="Login successful."
            )
        except Exception as e:
            print("!!! LOGIN CRASH !!!")
            print(f"Error Type: {type(e)}")
            print(f"Error Message: {str(e)}")
            traceback.print_exc()
            return error_response(
                message=f"Server Error: {str(e)}",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class LogoutView(APIView):
    """Blacklist the refresh token to log the user out."""

    permission_classes = [IsAuthenticated]

    def options(self, request, *args, **kwargs):
        return success_response(message="OPTIONS allowed")

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            if not refresh_token:
                return error_response(message="Refresh token is required.")

            token = RefreshToken(refresh_token)
            token.blacklist()

            return success_response(message="Logout successful.")
        except Exception:
            return error_response(message="Invalid or expired token.")


class ProfileView(APIView):
    """Get or update the authenticated user's profile."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return success_response(data=serializer.data, message="Profile retrieved.")

    def put(self, request):
        serializer = ProfileUpdateSerializer(
            request.user, data=request.data, partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        user_data = UserSerializer(request.user).data
        return success_response(data=user_data, message="Profile updated.")


class ChangePasswordView(APIView):
    """Change the authenticated user's password."""

    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        if not request.user.check_password(serializer.validated_data['old_password']):
            return error_response(
                message="Current password is incorrect.",
                status_code=status.HTTP_400_BAD_REQUEST
            )

        request.user.set_password(serializer.validated_data['new_password'])
        request.user.save()
        return success_response(message="Password changed successfully.")


class UserListView(generics.ListAPIView):
    """List all users (admin only) — for team member dropdowns."""

    serializer_class = UserListSerializer
    permission_classes = [IsAuthenticated, IsAdmin]
    queryset = User.objects.filter(is_active=True).order_by('full_name')
    filterset_fields = ['role', 'department']
    search_fields = ['full_name', 'email']
