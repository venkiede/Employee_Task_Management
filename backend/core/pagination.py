from rest_framework.pagination import PageNumberPagination


class StandardResultsSetPagination(PageNumberPagination):
    """
    Standard pagination class used across all list endpoints.
    Supports ?page=1&page_size=20 query parameters.
    """
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

    def get_paginated_response(self, data):
        response = super().get_paginated_response(data)
        response.data['current_page'] = self.page.number
        response.data['total_pages'] = self.page.paginator.num_pages
        return response
