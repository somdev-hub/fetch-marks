from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
import time

def get_output(driver, url, field2_value,field3_value):
    driver.get(url)
    time.sleep(5)
    # field1 = driver.find_element(By.NAME, "field1")
    field2 = driver.find_element(By.ID, "rollno")
    field3 = driver.find_element(By.ID, "dob")
    submit_button = driver.find_element(By.ID, "btnViewStudentReseltsList")

    # field1.send_keys(field1_value)
    field2.send_keys(field2_value)
    field3.send_keys(field3_value)
    submit_button.click()

    time.sleep(5)

    result = driver.find_element(By.ID, 'div-resultsList').text  # Adjust as per the HTML structure
    return result

url = 'results.bput.ac.in/'


driver = webdriver.Chrome()

try:
    # for input_data in inputs:
    #     result = get_output(driver, url, input_data['field1'], input_data['field2'])
    #     print(f"Input: {input_data} => Result: {result}")

    print(get_output(driver, url, '2101341021', '01-01-2000'))
finally:
    driver.quit()

    # return field1.get_attribute('innerHTML'), field2.get_attribute('innerHTML'), field3.get_attribute('innerHTML')