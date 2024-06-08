import requests
# from bs4 import BeautifulSoup
# import json
# import re
# # import requests
# import json


sgpa_url = "https://results.bput.ac.in/student-results-sgpa?rollNo=2101341021&semid=6&session=Even%20(2023-24)"
subject_url = "https://results.bput.ac.in/student-results-subjects-list?semid=6&rollNo=2101341021&session=Even%20(2023-24)"
std_details_url = "https://results.bput.ac.in/student-detsils-results?rollNo=2101341021"

def get_sgpa():
    response = requests.post(sgpa_url)
    return response.text

def get_subjects():
    response = requests.post(subject_url)
    return response.text

def get_std_details():
    response = requests.post(std_details_url)
    return response.text

print("SGPA:")
print(get_sgpa())
# print("Subjects:")
# print(get_subjects())
# print("Student Details:")
# print(get_std_details())

