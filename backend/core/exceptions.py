from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status


def custom_exception_handler(exc, context):
    """
    Custom exception handler that wraps all DRF errors
    into a consistent JSON format for the frontend.
    """
    response = exception_handler(exc, context)

    if response is not None:
        custom_response = {
            'success': False,
            'status_code': response.status_code,
            'errors': {},
            'message': 'An error occurred.',
        }

        if isinstance(response.data, dict):
            # Handle field-level validation errors
            if 'detail' in response.data:
                custom_response['message'] = str(response.data['detail'])
            else:
                custom_response['errors'] = response.data
                custom_response['message'] = 'Validation failed.'
        elif isinstance(response.data, list):
            custom_response['message'] = response.data[0] if response.data else 'An error occurred.'
        else:
            custom_response['message'] = str(response.data)

        response.data = custom_response

    return response
